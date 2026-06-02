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
    // Strip shebangs WITHOUT removing the newline. This keeps line numbers aligned.
    let fixed = code.replace(/^#!.*/, '');

    // 1. Handle standard imports/exports: import {x} from './y' or export {x} from './y'
    // Added a check to prevent double .mjs extensions
    fixed = fixed.replace(/(from|import|export)\s+(['"])(\..+?)(?:\.(?:js|can|ts))?\2/g, (match, p1, p2, p3) => {
        return p3.endsWith('.mjs') ? match : `${p1} ${p2}${p3}.mjs${p2}`;
    });
    
    // 2. Handle dynamic imports: import('./y')
    fixed = fixed.replace(/import\((['"])(\..+?)(?:\.(?:js|can|ts))?\1\)/g, (match, p1, p2) => {
        return p2.endsWith('.mjs') ? match : `import(${p1}${p2}.mjs${p1})`;
    });

    // Fix relative imports from examples pointing to src (since src is flattened in dist)
    if (fullPath.includes(path.sep + 'examples' + path.sep)) {
        fixed = fixed.replace(/from\s+(['"])\.\.\/(?:src\/)?([^/]+)\/([^/]+)\.mjs\1/g, "from $1../$3.mjs$1");
    }
    return fixed;
}

/**
 * Creates a TypeScript transformer that handles the fixImports logic 
 * during the compilation phase, ensuring source maps stay perfectly aligned.
 */
function getTsTransformers(fullPath: string): ts.CustomTransformers {
    const isExample = fullPath.includes(path.sep + 'examples' + path.sep);

    const transformer = (context: ts.TransformationContext) => {
        return (sourceFile: ts.SourceFile) => {
            function visitor(node: ts.Node): ts.Node {
                // Handle Import/Export declarations
                if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
                    if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                        let specifier = node.moduleSpecifier.text;
                        if (specifier.startsWith('.')) {
                            // Apply example path fix
                            if (isExample) {
                                specifier = specifier.replace(/^\.\.\/(?:src\/)?([^/]+)\/([^/]+)$/, '../$2');
                            }
                            // Ensure .mjs extension
                            if (!specifier.endsWith('.mjs')) {
                                specifier = specifier.replace(/\.(js|ts|can)$/, '') + '.mjs';
                            }
                            
                            const newSpecifier = ts.factory.createStringLiteral(specifier);
                            if (ts.isImportDeclaration(node)) {
                                return ts.factory.updateImportDeclaration(node, node.modifiers, node.importClause, newSpecifier, node.assertClause);
                            } else {
                                return ts.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause, newSpecifier, node.assertClause);
                            }
                        }
                    }
                }
                return ts.visitEachChild(node, visitor, context);
            }
            return ts.visitNode(sourceFile, visitor) as ts.SourceFile;
        };
    };

    return {
        before: [transformer]
    };
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
            count++;
        }
    }
    return count;
}

function renderProgressBar(current: number, total: number, message: string) {
    const width = 25;
    const progress = total > 0 ? current / total : 1;
    const filled = Math.min(width, Math.max(0, Math.round(width * progress)));
    const empty = Math.max(0, width - filled);
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
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
    
    const isSource = (ext === '.can' || (ext === '.ts' && !file.endsWith('.d.ts')));
    const outExt = isSource ? '.mjs' : ext;
    const outName = path.basename(file, ext) + outExt;

    // Calculate output path
    const relativePath = path.relative(inputRoot, path.dirname(fullPath));
    const outDir = path.join(outputRoot, relativePath);
    const outPath = path.join(outDir, outName);

    // Incremental check
    if (fs.existsSync(outPath) && stat.mtimeMs <= fs.statSync(outPath).mtimeMs) {
        return false; 
    }

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // Check for minification flag (CLI argument or programmatic override)
    const shouldMinify = minify || process.argv.includes('--minify');

    if (ext === '.can') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { code } = await transpile(content, defaultPlugins, fullPath);
        let processedCode = fixImports(code, fullPath);

        // TEMPORARY DEBUG LOG: Inspect the code before esbuild minification
        if (path.basename(fullPath) === 'Carousel.can') {
            console.log(`\n--- Processed Code for ${fullPath} (before esbuild) ---\n`);
            console.log(processedCode);
            console.log(`\n--- End Processed Code ---\n`);
        }

        // Minification logic using esbuild
        if (shouldMinify) {
            const minified = transformSync(processedCode, { minify: true, loader: 'js', target: 'es2020' });
            processedCode = minified.code;
        }

        saveFile(processedCode, fullPath, inputRoot, outputRoot, '.mjs');
    } else if (ext === '.ts' && !file.endsWith('.d.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Calculate relative path from the output directory back to the source file
        // This ensures sourcemaps work regardless of where the project is installed.
        const fileNameForTS = path.relative(outDir, fullPath);

        // Use Custom Transformers to fix imports during transpilation.
        // This keeps source maps aligned because TS tracks the changes internally.
        const transpiledOutput = ts.transpileModule(content, {
            fileName: fileNameForTS,
            transformers: getTsTransformers(fullPath),
            compilerOptions: {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.ESNext,
                moduleResolution: ts.ModuleResolutionKind.NodeNext,
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                noEmit: false,
                noEmitOnError: true,
                importHelpers: true,
                jsx: ts.JsxEmit.None,
                sourceMap: true,
                inlineSources: false,
                // Ensure shebangs don't cause issues by stripping them safely during parse
                removeComments: false 
            }
        });

        // The output is already "fixed" by the transformer, but we still strip 
        // the shebang if it exists without shifting line numbers.
        let processedCode = transpiledOutput.outputText.replace(/^#!.*/, '');

        // Minification logic using esbuild
        if (shouldMinify) {
            const minified = transformSync(processedCode, { minify: true, loader: 'js', target: 'es2020' });
            processedCode = minified.code;
        }

        saveFile(processedCode, fullPath, inputRoot, outputRoot, '.mjs');
        
        if (transpiledOutput.sourceMapText) {
            saveFile(transpiledOutput.sourceMapText, fullPath, inputRoot, outputRoot, '.mjs.map');
        }
    } else {
        // Static asset (HTML, CSS, JSON, Images, etc.): Copy instead of compile
        fs.copyFileSync(fullPath, outPath);
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
        
        context.current++;
        renderProgressBar(context.current, context.total, `Processing ${file}`);
        
        // Process the file using the unified buildFile function
        const built = await buildFile(fullPath, inputRoot, outputRoot, minify);
        
        if (built) context.built++; else context.skipped++;
    }
}

export async function build(targets?: string[], minify: boolean = false) {
    const cwd = process.cwd();
    const srcDir = path.join(cwd, 'src');
    const examplesDir = path.join(cwd, 'examples');
    const apiDir = path.join(cwd, 'api'); // Define API directory
    const buildDir = path.join(cwd, 'build'); // Define Build directory
    const distDir = path.join(cwd, 'dist');

    // Feature: clear-dist flag
    if (process.argv.includes('--clear') && fs.existsSync(distDir)) {
        console.log('\x1b[33m[Build]\x1b[0m Purging dist directory for a clean source mirror...');
        fs.rmSync(distDir, { recursive: true, force: true });
    }

    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    const hasTargets = targets && targets.length > 0;

    const context: BuildContext = {
        total: hasTargets 
            ? targets!.reduce((sum, t) => {
                const p = path.resolve(cwd, t);
                return sum + (fs.existsSync(p) ? (fs.statSync(p).isDirectory() ? countFiles(p) : 1) : 0);
              }, 0)
            : (countFiles(srcDir) + countFiles(examplesDir) + countFiles(apiDir) + countFiles(buildDir)),
        current: 0,
        built: 0,
        skipped: 0
    };

    console.log(`Compiling Can project${context.total > 0 ? ` (${context.total} files)` : ''}...`);

    if (hasTargets) {
        for (const target of targets!) {
            const fullPath = path.resolve(cwd, target);
            if (!fs.existsSync(fullPath)) continue;

            const isDir = fs.statSync(fullPath).isDirectory();
            
            let inputRoot = '';
            let outputRoot = '';
            if (fullPath.startsWith(srcDir)) { inputRoot = srcDir; outputRoot = distDir; }
            else if (fullPath.startsWith(examplesDir)) { inputRoot = examplesDir; outputRoot = path.join(distDir, 'examples'); }
            else if (fullPath.startsWith(apiDir)) { inputRoot = apiDir; outputRoot = path.join(distDir, 'api'); }
            else if (fullPath.startsWith(buildDir)) { inputRoot = buildDir; outputRoot = path.join(distDir, 'build'); }
            else { inputRoot = path.dirname(fullPath); outputRoot = distDir; }

            if (isDir) {
                await processDirectory(fullPath, inputRoot, outputRoot, minify, context);
            } else {
                context.current++;
                renderProgressBar(context.current, context.total, `Building ${path.basename(fullPath)}`);
                const built = await buildFile(fullPath, inputRoot, outputRoot, minify);
                if (built) context.built++; else context.skipped++;
            }
        }
    } else {
        await processDirectory(srcDir, srcDir, distDir, minify, context);
        await processDirectory(examplesDir, examplesDir, path.join(distDir, 'examples'), minify, context);
        await processDirectory(apiDir, apiDir, path.join(distDir, 'api'), minify, context);
        await processDirectory(buildDir, buildDir, path.join(distDir, 'build'), minify, context);
    }

    process.stdout.write('\n');
    console.log(`\x1b[32mBuild finished.\x1b[0m ${context.built} files updated, ${context.skipped} skipped.`);

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

    // Copy other files from public/ (images, icons, etc.)
    if (fs.existsSync(publicDir)) {
        fs.readdirSync(publicDir).forEach(file => {
            if (file === 'index.html') return;
            const src = path.join(publicDir, file);
            const dest = path.join(distDir, file);
            if (fs.statSync(src).isDirectory()) {
                fs.cpSync(src, dest, { recursive: true });
            } else {
                fs.copyFileSync(src, dest);
            }
        });
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

    // Generate API barrel file after all API routes are built
    await generateApiBarrelFile(path.join(distDir, 'api'));
}

// Run if called directly
const isMain = () => {
    if (typeof process === 'undefined' || !process.argv[1]) return false;
    try {
        const entryPath = path.resolve(process.argv[1]);
        return entryPath === fileURLToPath(import.meta.url);
    } catch {
        return false;
    }
};

if (isMain()) {
    build();
}

// Helper to convert kebab-case to camelCase
function kebabToCamelCase(kebab: string): string {
    return kebab.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Generates a barrel file (routes.mjs) for all API routes in the output directory.
 * Each API route file is assumed to export a default handler.
 */
async function generateApiBarrelFile(apiOutputRoot: string) {
    if (!fs.existsSync(apiOutputRoot)) {
        return;
    }

    const files = fs.readdirSync(apiOutputRoot);
    const exportStatements: string[] = [];

    for (const file of files) {
        // Exclude index.mjs (main server entry), routes.mjs (the barrel itself), and any files within 'route/' subdirectories
        if (file.endsWith('.mjs') && file !== 'index.mjs' && file !== 'routes.mjs' && !file.startsWith('route/')) {
            const baseName = path.basename(file, '.mjs');
            const camelCaseName = kebabToCamelCase(baseName);
            exportStatements.push(`export { default as ${camelCaseName} } from './${file}';`);
        }
    }

    if (exportStatements.length > 0) {
        const barrelFilePath = path.join(apiOutputRoot, 'routes.mjs');
        fs.writeFileSync(barrelFilePath, exportStatements.join('\n') + '\n');
        console.log(`\x1b[32mGenerated API barrel file:\x1b[0m ${path.relative(process.cwd(), barrelFilePath)}`);
    }
}
