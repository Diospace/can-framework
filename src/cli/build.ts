import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as ts from 'typescript';
import { transformSync } from 'esbuild';
import { transpile } from '../compiler/codegen';
import { cMountPlugin } from '../compiler/directives/c-mount-plugin';
import { onUpdatePlugin } from '../compiler/directives/on-update';
import { cIfPlugin } from '../compiler/directives/c-if';
import { cForPlugin } from '../compiler/directives/c-for';
import { cBindPlugin } from '../compiler/directives/c-bind';
import { cModelPlugin } from '../compiler/directives/c-model';
import { cShowPlugin } from '../compiler/directives/c-show';

/**
 * Helper to fix import paths: ensure relative imports use .mjs extensions
 * and handle example-specific path adjustments.
 */
export function fixImports(code: string, fullPath: string): string {
    // 1. Handle standard imports/exports: import {x} from './y' or export {x} from './y'
    let fixed = code.replace(/(from|import|export)\s+(['"])(\..+?)(?:\.js|\.can|\.ts)?\2/g, "$1 $2$3.mjs$2");
    
    // 2. Handle dynamic imports: import('./y')
    fixed = fixed.replace(/import\((['"])(\..+?)(?:\.js|\.can|\.ts)?\1\)/g, "import($1$2.mjs$1)");

    // Ensure we don't end up with .mjs.mjs
    fixed = fixed.replace(/\.mjs\.mjs/g, '.mjs');

    // Fix relative imports from examples pointing to src (since src is flattened in dist)
    if (fullPath.includes('examples')) {
        fixed = fixed.replace(/from\s+(['"])\.\.\/(?:src\/)?([^/]+)\/([^/]+)\.mjs\1/g, "from $1../$3.mjs$1");
    }
    return fixed;
}

/**
 * Default plugins used by the framework transpiler
 */
export const defaultPlugins = [ 
    cMountPlugin,
    onUpdatePlugin,
    cIfPlugin,
    cForPlugin,
    cBindPlugin,
    cModelPlugin,
    cShowPlugin
];

/**
 * Determines the output path and ensures the directory exists
 */
function saveFile(content: string, sourcePath: string, inputRoot: string, outputRoot: string, newExt: string) {
    const relativePath = path.relative(inputRoot, path.dirname(sourcePath));
    const outDir = path.join(outputRoot, relativePath);
    
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    const outName = path.basename(sourcePath, path.extname(sourcePath)) + newExt;
    const outPath = path.join(outDir, outName);
    fs.writeFileSync(outPath, content);
}

interface BuildContext {
    total: number;
    current: number;
    built: number;
    skipped: number;
}

function countFiles(dir: string): number {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            count += countFiles(fullPath);
        } else {
            const ext = path.extname(item);
            if ((ext === '.can' || ext === '.ts') && !item.endsWith('.d.ts')) {
                count++;
            }
        }
    }
    return count;
}

function renderProgressBar(current: number, total: number, message: string) {
    const width = 25;
    const progress = total > 0 ? current / total : 1;
    const filled = Math.round(width * progress);
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
    const percent = Math.round(progress * 100);
    process.stdout.write(`\r\x1b[36m[Can Build]\x1b[0m [${bar}] ${percent}% | ${message.padEnd(30).slice(0, 30)}`);
}

/**
 * Processes a single file. Useful for optimized watch cycles.
 */
async function buildFile(fullPath: string, inputRoot: string, outputRoot: string, minify: boolean = false) {
    const file = path.basename(fullPath);
    const ext = path.extname(file);
    const stat = fs.statSync(fullPath);

    // Calculate output path
    const relativePath = path.relative(inputRoot, path.dirname(fullPath));
    const outDir = path.join(outputRoot, relativePath);
    const outName = path.basename(file, ext) + '.mjs';
    const outPath = path.join(outDir, outName);

    // Incremental check
    if (fs.existsSync(outPath) && stat.mtimeMs <= fs.statSync(outPath).mtimeMs) {
        return false; 
    }

    // Check for minification flag (CLI argument or programmatic override)
    const shouldMinify = minify || process.argv.includes('--minify');

    if (ext === '.can') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { code } = await transpile(content, defaultPlugins, fullPath);
        let processedCode = fixImports(code, fullPath);

        // Minification logic using esbuild
        if (shouldMinify) {
            const minified = transformSync(processedCode, { minify: true, loader: 'js', target: 'es2020' });
            processedCode = minified.code;
        }

        saveFile(processedCode, fullPath, inputRoot, outputRoot, '.mjs');
    } else if (ext === '.ts' && !file.endsWith('.d.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        const transpiledOutput = ts.transpileModule(content, {
            compilerOptions: {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.ESNext,
                moduleResolution: ts.ModuleResolutionKind.NodeNext,
                strict: true,
                esModuleInterop: true,
                skipLibCheck: false,
                noEmit: false,
                noEmitOnError: true,
                importHelpers: true,
                jsx: ts.JsxEmit.None,
                sourceMap: true,
                inlineSources: true
            }
        });

        let processedCode = fixImports(transpiledOutput.outputText, fullPath);

        // Minification logic using esbuild
        if (shouldMinify) {
            const minified = transformSync(processedCode, { minify: true, loader: 'js', target: 'es2020' });
            processedCode = minified.code;
        }

        saveFile(processedCode, fullPath, inputRoot, outputRoot, '.mjs');
    }
    return true;
}

/**
 * Recursively process files in a directory
 */
async function processDirectory(dir: string, inputRoot: string, outputRoot: string, minify: boolean, context: BuildContext) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath, inputRoot, outputRoot, minify, context);
            continue;
        }
        
        const ext = path.extname(file);
        if ((ext !== '.can' && ext !== '.ts') || file.endsWith('.d.ts')) continue;

        context.current++;
        renderProgressBar(context.current, context.total, `Building ${file}`);
        
        // Process the file using the unified buildFile function
        const built = await buildFile(fullPath, inputRoot, outputRoot, minify);
        if (built) context.built++; else context.skipped++;
    }
}

export async function build(specificFile?: string, minify: boolean = false) {
    const cwd = process.cwd();
    const srcDir = path.join(cwd, 'src');
    const examplesDir = path.join(cwd, 'examples');
    const distDir = path.join(cwd, 'dist');

    // Feature: clear-dist flag
    if (process.argv.includes('--clear') && fs.existsSync(distDir)) {
        console.log('Clearing dist directory...');
        // Preserve the CLI bundle so the build tool doesn't delete itself
        const items = fs.readdirSync(distDir);
        for (const item of items) {
            if (item === 'index.mjs' || item === 'cli') continue;
            fs.rmSync(path.join(distDir, item), { recursive: true, force: true });
        }
    }

    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    const context: BuildContext = {
        total: specificFile ? 1 : (countFiles(srcDir) + countFiles(examplesDir)),
        current: 0,
        built: 0,
        skipped: 0
    };

    console.log(`Compiling Can project${context.total > 0 ? ` (${context.total} files)` : ''}...`);

    if (specificFile) {
        const fullPath = path.resolve(cwd, specificFile);
        context.current++;
        renderProgressBar(context.current, context.total, `Building ${path.basename(fullPath)}`);
        
        let built = false;
        if (fullPath.startsWith(srcDir)) {
            built = await buildFile(fullPath, srcDir, distDir, minify);
        } else if (fullPath.startsWith(examplesDir)) {
            built = await buildFile(fullPath, examplesDir, path.join(distDir, 'examples'), minify);
        }
        if (built) context.built++; else context.skipped++;
        process.stdout.write('\n');
        return;
    }

    await processDirectory(srcDir, srcDir, distDir, minify, context);
    await processDirectory(examplesDir, examplesDir, path.join(distDir, 'examples'), minify, context);
    process.stdout.write('\n');
    console.log(`\x1b[32mBuild finished.\x1b[0m ${context.built} compiled, ${context.skipped} skipped.`);

    // Handle public/index.html injection for production
    const publicDir = path.join(cwd, 'public');
    const indexHtml = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
        let htmlContent = fs.readFileSync(indexHtml, 'utf-8');
        // Automatically inject the entry point script if not present
        if (!htmlContent.includes('main.mjs')) {
            htmlContent = htmlContent.replace('</body>', '<script type="module" src="/main.mjs"></script></body>');
        }
        fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
    }

    // Copy examples/index.html to dist/examples/index.html
    const exampleIndexHtml = path.join(examplesDir, 'index.html');
    if (fs.existsSync(exampleIndexHtml)) {
        let htmlContent = fs.readFileSync(exampleIndexHtml, 'utf-8');
        const exampleOutDir = path.join(distDir, 'examples');
        if (!fs.existsSync(exampleOutDir)) fs.mkdirSync(exampleOutDir, { recursive: true });
        
        // Ensure the example entry point (main.mjs or index.mjs) is injected
        if (!htmlContent.includes('.mjs')) {
            htmlContent = htmlContent.replace('</body>', '<script type="module" src="./main.mjs"></script></body>');
        }
        fs.writeFileSync(path.join(exampleOutDir, 'index.html'), htmlContent);
    }
}

// Run if called directly
const isMain = () => {
    if (typeof process === 'undefined' || !process.argv[1]) return false;
    const entryPath = path.resolve(process.argv[1]);
    return entryPath === fileURLToPath(import.meta.url);
};

if (isMain()) {
    build();
}
