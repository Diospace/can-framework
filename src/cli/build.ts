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

/**
 * Processes a single file. Useful for optimized watch cycles.
 */
async function buildFile(fullPath: string, inputRoot: string, outputRoot: string) {
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

    if (ext === '.can') {
        console.log(`Building: ${file}`);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { code } = await transpile(content, defaultPlugins, fullPath);
        let processedCode = fixImports(code, fullPath);

        // Minification logic using esbuild
        if (process.argv.includes('--minify')) {
            const minified = transformSync(processedCode, { minify: true, loader: 'js', target: 'es2020' });
            processedCode = minified.code;
        }

        saveFile(processedCode, fullPath, inputRoot, outputRoot, '.mjs');
    } else if (ext === '.ts' && !file.endsWith('.d.ts')) {
        console.log(`Building: ${file}`);
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
        if (process.argv.includes('--minify')) {
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
async function processDirectory(dir: string, inputRoot: string, outputRoot: string) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath, inputRoot, outputRoot);
            continue;
        }
        
        // Process the file using the unified buildFile function
        await buildFile(fullPath, inputRoot, outputRoot);
    }
}

export async function build(specificFile?: string) {
    console.log('Compiling Can project...');
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

    if (specificFile) {
        const fullPath = path.resolve(cwd, specificFile);
        if (fullPath.startsWith(srcDir)) {
            await buildFile(fullPath, srcDir, distDir);
        } else if (fullPath.startsWith(examplesDir)) {
            await buildFile(fullPath, examplesDir, path.join(distDir, 'examples'));
        }
        return;
    }

    await processDirectory(srcDir, srcDir, distDir);
    await processDirectory(examplesDir, examplesDir, path.join(distDir, 'examples'));
    console.log(`Build finished. Output generated in ${distDir}`);

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
        fs.copyFileSync(exampleIndexHtml, path.join(distDir, 'examples', 'index.html'));
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
