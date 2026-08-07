import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
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
 * Helper to calculate output path consistently
 */
export function getOutputPath(sourcePath: string, inputRoot: string, outputRoot: string, newExt: string): string {
    const relativePath = path.relative(inputRoot, sourcePath);
    const sourceExt = path.extname(sourcePath);
    let outRelativePath = relativePath;
    if (sourceExt) { // Only replace extension if sourcePath has one (i.e., it's a file)
        outRelativePath = relativePath.replace(new RegExp(`${sourceExt}$`), newExt);
    }
    return path.join(outputRoot, outRelativePath);
}

/**
 * Internal helper to find where a file will be placed in dist to calculate relative imports
 */
export function getCalculatedOutputPath(fullPath: string, normalizedCwd?: string): string {
    const normalize = (p: string) => path.resolve(p).replace(/^[a-z]:/i, (m) => m.toUpperCase());
    const nCwd = normalizedCwd || normalize(process.cwd());
    const absPath = normalize(fullPath);
    const distDir = path.join(nCwd, 'dist');

    const isInside = (dirName: string): string | null => {
        const root = path.join(nCwd, dirName);
        const rel = path.relative(root, absPath);
        // Fix: "" rel path means it IS the directory, which is valid for imports
        const inside = (rel === "" || (rel && !rel.startsWith('..') && !path.isAbsolute(rel)));
        return inside ? root : null;
    };

    const srcMatch = isInside('src');
    if (srcMatch) return getOutputPath(absPath, srcMatch, distDir, '.mjs');

    const exampleMatch = isInside('examples');
    if (exampleMatch) return getOutputPath(absPath, exampleMatch, path.join(distDir, 'examples'), '.mjs');

    const apiMatch = isInside('api');
    if (apiMatch) return getOutputPath(absPath, apiMatch, path.join(distDir, 'api'), '.mjs');

    const buildMatch = isInside('build');
    if (buildMatch) return getOutputPath(absPath, buildMatch, path.join(distDir, 'build'), '.mjs');

    return getOutputPath(absPath, path.dirname(absPath), distDir, '.mjs');
}

/**
 * Helper to resolve an import specifier to its final .mjs path in the dist folder
 */
function resolveImportPath(fullPath: string, specifier: string): string {
    const currentFileOutputPath = getCalculatedOutputPath(fullPath);
    const currentFileOutputDir = path.dirname(currentFileOutputPath);

    const importedSourcePath = path.resolve(path.dirname(fullPath), specifier);
    let targetOutputPath = getCalculatedOutputPath(importedSourcePath); // This will be the path to the directory or file

    if (fs.existsSync(importedSourcePath) && fs.statSync(importedSourcePath).isDirectory()) { // Check if the source is a directory
        const dirName = path.basename(importedSourcePath); // e.g., 'shared'
        const mainFile = (fs.existsSync(path.join(importedSourcePath, 'index.ts')) || fs.existsSync(path.join(importedSourcePath, 'index.can')))
            ? 'index.mjs'
            : `${dirName}.mjs`;
        targetOutputPath = path.join(targetOutputPath, mainFile);
    } else {
        targetOutputPath = targetOutputPath.replace(/\.(js|ts|can|mjs)$/, '') + '.mjs';
    }

    let newSpecifier = path.relative(currentFileOutputDir, targetOutputPath).replace(/\\/g, '/');
    if (!newSpecifier.startsWith('.') && !newSpecifier.startsWith('/')) {
        newSpecifier = './' + newSpecifier;
    }
    return newSpecifier;
}

/**
 * Helper to fix import paths: ensure relative imports use .mjs extensions
 * and handle example-specific path adjustments.
 */
export function fixImports(code: string, fullPath: string, providedFrameworkImport?: string): string {
    // Strip shebangs WITHOUT removing the newline. This keeps line numbers aligned.
    let fixed = code.replace(/^#!.*/, '');

    // Calculate framework import path if not provided, otherwise use the provided one.
    const frameworkImportToUse = providedFrameworkImport || (() => {
        const cwd = process.cwd();
        const distDir = path.join(cwd, 'dist');
        const currentFileOutputPath = getCalculatedOutputPath(fullPath);
        const frameworkDistPath = path.join(distDir, 'can-framework.mjs');
        const rel = path.relative(path.dirname(currentFileOutputPath), frameworkDistPath).replace(/\\/g, '/');
        return rel.startsWith('.') ? rel : './' + rel;
    })();

    // 0. Handle bare framework imports: convert @decaspace/can-framework to relative runtime path
    fixed = fixed.replace(/(from|import|export)\s+(['"])@decaspace\/can-framework\2/g, (match, p1, p2) => {
        return `${p1} ${p2}${frameworkImportToUse}${p2}`;
    });

    // 0.1 Handle framework import placeholder from codegen.ts
    fixed = fixed.replace(/from\s+(['"])__CAN_FRAMEWORK_IMPORT__\1/g, (match, p1) => {
        return `from ${p1}${frameworkImportToUse}${p1}`;
    });

    // 1. Handle standard imports/exports: import {x} from './y' or export {x} from './y'
    // Added a check to prevent double .mjs extensions
    fixed = fixed.replace(/(from|import|export)\s+(['"])(\..+?)(?:\.(?:js|can|ts|mjs))?\2/g, (match, p1, p2, p3) => {
        return `${p1} ${p2}${resolveImportPath(fullPath, p3)}${p2}`;
    });

    // 2. Handle dynamic imports: import('./y')
    fixed = fixed.replace(/import\((['"])(\..+?)(?:\.(?:js|can|ts|mjs))?\1\)/g, (match, p1, p2) => {
        return `import(${p1}${resolveImportPath(fullPath, p2)}${p1})`;
    });
    return fixed;
}

/**
 * Creates a TypeScript transformer that handles the fixImports logic 
 * during the compilation phase, ensuring source maps stay perfectly aligned.
 */
function getTsTransformers(fullPath: string): ts.CustomTransformers {
    const isExample = fullPath.includes(path.sep + 'examples' + path.sep);
    const cwd = process.cwd();
    const distDir = path.join(cwd, 'dist');
    const currentFileOutputPath = getCalculatedOutputPath(fullPath);
    const frameworkDistPath = path.join(distDir, 'can-framework.mjs');
    const frameworkImportResolved = path.relative(path.dirname(currentFileOutputPath), frameworkDistPath).replace(/\\/g, '/');
    const finalFrameworkImport = frameworkImportResolved.startsWith('.') ? frameworkImportResolved : './' + frameworkImportResolved;

    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = (context: ts.TransformationContext) => {
        return (sourceFile: ts.SourceFile) => {
            function visitor(node: ts.Node): ts.Node {
                // Handle Import/Export declarations
                if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
                    if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                        let specifier = node.moduleSpecifier.text;
                        // Handle bare framework import
                        if (specifier === '@decaspace/can-framework') {
                            specifier = finalFrameworkImport; // Corrected variable name
                        }
                        if (specifier.startsWith('.')) {
                            const newSpecifier = ts.factory.createStringLiteral(resolveImportPath(fullPath, specifier));
                            if (ts.isImportDeclaration(node)) {
                                return ts.factory.updateImportDeclaration(node, node.modifiers, node.importClause, newSpecifier, node.attributes);
                            } else {
                                return ts.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause, newSpecifier, node.attributes);
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
        before: [transformerFactory]
    };
}

/**
 * Determines the output path and ensures the directory exists
 */
async function saveFile(content: string, sourcePath: string, inputRoot: string, outputRoot: string, newExt: string) {
    const outPath = getOutputPath(sourcePath, inputRoot, outputRoot, newExt);
    const outDir = path.dirname(outPath);

    if (!fs.existsSync(outDir)) {
        await fs.promises.mkdir(outDir, { recursive: true });
    }

    await fs.promises.writeFile(outPath, content);
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
async function buildFile(fullPath: string, inputRoot: string, outputRoot: string, minify: boolean = false): Promise<boolean> {
    const file = path.basename(fullPath);
    const ext = path.extname(file);
    const stat = await fs.promises.stat(fullPath); // Use async stat

    const isSource = (ext === '.can' || (ext === '.ts' && !file.endsWith('.d.ts')));
    const outExt = isSource ? '.mjs' : ext;

    const outPath = getOutputPath(fullPath, inputRoot, outputRoot, outExt);
    const outDir = path.dirname(outPath);

    // Incremental check
    if (fs.existsSync(outPath) && stat.mtimeMs <= (await fs.promises.stat(outPath)).mtimeMs) { // Use async stat
        return false;
    }

    if (!fs.existsSync(outDir)) { // Keep fs.existsSync for quick check
        await fs.promises.mkdir(outDir, { recursive: true }); // Use async mkdir
    }

    // Check for minification flag (CLI argument or programmatic override)
    const shouldMinify = minify || process.argv.includes('--minify');

    if (ext === '.can') {
        const content = await fs.promises.readFile(fullPath, 'utf-8'); // Use async readFile

        // Calculate finalFrameworkImport locally for .can files as it's not in this scope
        const cwd = process.cwd();
        const distDir = path.join(cwd, 'dist');
        const currentFileOutputPath = getCalculatedOutputPath(fullPath);
        const frameworkDistPath = path.join(distDir, 'can-framework.mjs');
        const localFinalFrameworkImport = path.relative(path.dirname(currentFileOutputPath), frameworkDistPath).replace(/\\/g, '/');
        const finalFrameworkImportForCan = localFinalFrameworkImport.startsWith('.') ? localFinalFrameworkImport : './' + localFinalFrameworkImport;
        const { code } = await transpile(content, defaultPlugins, fullPath, finalFrameworkImportForCan); // Pass localFinalFrameworkImport
        let processedCode = fixImports(code, fullPath, finalFrameworkImportForCan); // Pass localFinalFrameworkImport



        if (shouldMinify) {
            try {
                const minified = transformSync(processedCode, { minify: true, loader: 'js', target: 'es2020' });
                processedCode = minified.code;
            } catch (err) {
                console.error(`\n\x1b[31m[Minify Error]\x1b[0m Failed to minify compiled output for ${file}.`);
                throw err;
            }
        }

        await saveFile(processedCode, fullPath, inputRoot, outputRoot, '.mjs'); // Use async saveFile
    } else if (ext === '.ts' && !file.endsWith('.d.ts')) {
        const content = await fs.promises.readFile(fullPath, 'utf-8'); // Use async readFile

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

        // TypeScript always names source maps *.js.map regardless of the output
        // extension. Align the comment with the *.mjs.map files we actually save.
        processedCode = processedCode.replace(/(\/\/# sourceMappingURL=)(.+?)\.js\.map/g, (m, prefix, name) => `${prefix}${name}.mjs.map`);

        // Minification logic using esbuild
        if (shouldMinify) {
            try {
                const minified = transformSync(processedCode, { minify: true, loader: 'js', target: 'es2020' });
                processedCode = minified.code;
            } catch (err) {
                console.error(`\n\x1b[31m[Minify Error]\x1b[0m Failed to minify ${fullPath}. Check generated syntax.`);
                throw err;
            }
        }

        await saveFile(processedCode, fullPath, inputRoot, outputRoot, '.mjs'); // Use async saveFile

        if (transpiledOutput.sourceMapText) {
            await saveFile(transpiledOutput.sourceMapText, fullPath, inputRoot, outputRoot, '.mjs.map'); // Use async saveFile
        }
    } else {
        // Static asset (HTML, CSS, JSON, Images, etc.): Copy instead of compile
        await fs.promises.copyFile(fullPath, outPath); // Use async copyFile
    }

    return true;
}

/**
 * Recursively process files in a directory
 */
async function processDirectory(dir: string, inputRoot: string, outputRoot: string, minify: boolean, context: BuildContext) {
    if (!fs.existsSync(dir)) return;

    const files = await fs.promises.readdir(dir, { withFileTypes: true }); // Get dirent objects

    await Promise.all(files.map(async (file) => {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) { // Check dirent type
            await processDirectory(fullPath, inputRoot, outputRoot, minify, context);
            return; // Don't count directories as files
        }

        context.current++;
        renderProgressBar(context.current, context.total, `Processing ${file.name}`);
        const built = await buildFile(fullPath, inputRoot, outputRoot, minify);
        if (built) context.built++; else context.skipped++;
    }));
}

export async function build(targets?: string[], minify: boolean = false) {
    const normalize = (p: string) => path.resolve(p).replace(/^[a-z]:/i, (m) => m.toUpperCase());
    const cwd = normalize(process.cwd());
    const srcDir = path.join(cwd, 'src');
    const examplesDir = path.join(cwd, 'examples');
    const apiDir = path.join(cwd, 'api');
    const buildDir = path.join(cwd, 'build');
    const distDir = path.join(cwd, 'dist');

    // Feature: clear-dist flag
    if (process.argv.includes('--clear') && fs.existsSync(distDir)) {
        try {
            console.log('\x1b[33m[Build]\x1b[0m Purging dist directory for a clean source mirror...');
            await fs.promises.rm(distDir, { recursive: true, force: true }); // Use async rm
        } catch (err: any) {
            console.warn(`\x1b[33m[Build Warning]\x1b[0m Could not fully clear dist directory: ${err.message}`);
            // Continue anyway, as individual file writes might still succeed or overwrite.
        }
    }

    if (!fs.existsSync(distDir)) { // Keep fs.existsSync for quick check
        await fs.promises.mkdir(distDir, { recursive: true }); // Use async mkdir
    }

    const hasTargets = targets && targets.length > 0;

    const context: BuildContext = {
        total: hasTargets
            ? targets!.reduce((sum, t) => {
                const p = path.resolve(cwd, t);
                return sum + (fs.existsSync(p) ? (fs.statSync(p).isDirectory() ? countFiles(p) : 1) : 0); // Keep sync for initial count
            }, 0)
            : (countFiles(srcDir) + countFiles(examplesDir) + countFiles(apiDir) + countFiles(buildDir)),
        current: 0,
        built: 0,
        skipped: 0
    };

    console.log(`Compiling Can project${context.total > 0 ? ` (${context.total} files)` : ''}...`);

    if (hasTargets) {
        for (const target of targets!) {
            const fullPath = normalize(path.resolve(cwd, target));
            if (!fs.existsSync(fullPath)) continue; // Keep sync for quick check

            const isDir = (await fs.promises.stat(fullPath)).isDirectory(); // Use async stat

            let inputRoot = '';
            let outputRoot = '';
            if (fullPath.startsWith(srcDir)) { inputRoot = srcDir; outputRoot = distDir; }
            else if (fullPath.startsWith(examplesDir)) { inputRoot = examplesDir; outputRoot = path.join(distDir, 'examples'); }
            else if (fullPath.startsWith(apiDir)) { inputRoot = apiDir; outputRoot = path.join(distDir, 'api'); }
            else if (fullPath.startsWith(buildDir)) { inputRoot = buildDir; outputRoot = path.join(distDir, 'build'); }
            else { inputRoot = path.dirname(fullPath); outputRoot = distDir; }

            if (isDir) {
                await processDirectory(fullPath, inputRoot, outputRoot, minify, context); // Await async processDirectory
            } else {
                context.current++;
                renderProgressBar(context.current, context.total, `Building ${path.basename(fullPath)}`);
                const built = await buildFile(fullPath, inputRoot, outputRoot, minify); // Await async buildFile
                if (built) context.built++; else context.skipped++;
            }
        }
    } else {
        await processDirectory(srcDir, srcDir, distDir, minify, context); // Await async processDirectory
        await processDirectory(examplesDir, examplesDir, path.join(distDir, 'examples'), minify, context); // Await async processDirectory
        await processDirectory(apiDir, apiDir, path.join(distDir, 'api'), minify, context); // Await async processDirectory
        await processDirectory(buildDir, buildDir, path.join(distDir, 'build'), minify, context); // Await async processDirectory
    }

    process.stdout.write('\n');
    console.log(`\x1b[32mBuild finished.\x1b[0m ${context.built} files updated, ${context.skipped} skipped.`);

    // Determine the framework's root directory
    const frameworkRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

    // Only copy framework runtime to project dist if we are NOT building the framework itself.
    // This prevents copying 'dist/reactivity' to 'dist/reactivity' when building the framework.
    if (cwd !== frameworkRoot) {
        const frameworkDist = path.resolve(frameworkRoot, 'dist'); // Path to the framework's own compiled output
        const runtimeFiles = [
            'index.mjs', 'runtime-helpers.mjs',
            'reactivity', 'runtime-core', 'runtime-dom', 'shared', 'store', 'router', 'devtools'
        ];

        // Copy sequentially (not Promise.all): parallel fs.cp calls race on the parent
        // directory's mkdir and throw EEXIST. Also purge any stale destination first so a
        // partial/aborted build cannot block the copy. 'components' is deliberately excluded:
        // it holds the framework's demo components and would clobber the project's own
        // src/components*. (the runtime chain never imports it).
        for (const file of runtimeFiles) { // Use for...of for ordered async copy
            const src = path.join(frameworkDist, file);
            const dest = path.join(distDir, file === 'index.mjs' ? 'can-framework.mjs' : file);
            if (fs.existsSync(src)) {
                if (fs.existsSync(dest)) await fs.promises.rm(dest, { recursive: true, force: true });
                if ((await fs.promises.stat(src)).isDirectory()) await fs.promises.cp(src, dest, { recursive: true, force: true });
                else await fs.promises.copyFile(src, dest);
            }
        }
    }

    // Handle public/index.html injection for the current project (framework or user app).
    // This part should always run for the current project's dist.
    const publicDir = path.join(cwd, 'public');
    const indexHtml = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
        let htmlContent = await fs.promises.readFile(indexHtml, 'utf-8'); // Use async readFile
        // Automatically inject the entry point script if not present
        if (!htmlContent.includes('main.mjs')) {
            htmlContent = htmlContent.replace('</body>', '<script type="module" src="/main.mjs"></script></body>');
        }
        await fs.promises.writeFile(path.join(distDir, 'index.html'), htmlContent); // Use async writeFile
    }

    // Copy other files from public/ (images, icons, etc.)
    if (fs.existsSync(publicDir)) {
        await Promise.all(fs.readdirSync(publicDir).map(async file => { // Use Promise.all for async copy
            if (file === 'index.html') return;
            const src = path.join(publicDir, file);
            const dest = path.join(distDir, file);
            if (fs.statSync(src).isDirectory()) { // Keep sync for quick check
                await fs.promises.cp(src, dest, { recursive: true }); // Use async cp
            } else {
                await fs.promises.copyFile(src, dest); // Use async copyFile
            }
        }));
    }

    // Copy examples/index.html to dist/examples/index.html
    const exampleIndexHtml = path.join(examplesDir, 'index.html');
    if (fs.existsSync(exampleIndexHtml)) {
        let htmlContent = await fs.promises.readFile(exampleIndexHtml, 'utf-8'); // Use async readFile
        const exampleOutDir = path.join(distDir, 'examples');
        if (!fs.existsSync(exampleOutDir)) await fs.promises.mkdir(exampleOutDir, { recursive: true }); // Use async mkdir

        // Ensure the example entry point (main.mjs or index.mjs) is injected
        if (!htmlContent.includes('.mjs')) {
            htmlContent = htmlContent.replace('</body>', '<script type="module" src="./main.mjs"></script></body>');
        }
        await fs.promises.writeFile(path.join(exampleOutDir, 'index.html'), htmlContent); // Use async writeFile
    }

    // Generate API barrel file after all API routes are built
    await generateApiBarrelFile(path.join(distDir, 'api'));
}

// NOTE: Avoid adding a direct `build()` auto-invocation here. The CLI bundle bundles all
// modules into a single file, so an `import.meta.url === process.argv[1]` guard evaluates
// true for every module and would fire `build()` again on top of the dispatcher call in
// index.ts, racing two builds.

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
        if (file.endsWith('.mjs') && file !== 'index.mjs' && file !== 'routes.mjs' && !file.startsWith('route/')) { // Keep sync readdir for now
            const baseName = path.basename(file, '.mjs');
            const camelCaseName = kebabToCamelCase(baseName);
            exportStatements.push(`export { default as ${camelCaseName} } from './${file}';`);
        }
    }

    if (exportStatements.length > 0) {
        const barrelFilePath = path.join(apiOutputRoot, 'routes.mjs');
        await fs.promises.writeFile(barrelFilePath, exportStatements.join('\n') + '\n'); // Use async writeFile
        console.log(`\x1b[32mGenerated API barrel file:\x1b[0m ${path.relative(process.cwd(), barrelFilePath)}`);
    }
}
