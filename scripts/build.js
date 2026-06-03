import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Orchestrates the full build process of the Can Framework.
 */
console.log('\x1b[34m%s\x1b[0m', '>>> Starting Framework Build...');

try {
    // 1. Ensure the CLI is compiled before attempting to run it or type-check.
    // const cliEntry = path.resolve(__dirname, '../dist/index.mjs');
    // if (!fs.existsSync(cliEntry)) {
    //     console.log('\x1b[33m%s\x1b[0m', '>>> dist/index.mjs not found. Bootstrapping CLI tool...');
    //     execSync('npm run compile', { stdio: 'inherit' });
    // }

    // 1. Run Type Checking
    console.log('\x1b[36m%s\x1b[0m', '>>> Running type check...');
    execSync('npm run type-check', { stdio: 'inherit' });

    // Determine if we should minify based on environment variables
    const isProd = 
        process.env.NODE_ENV === 'production' || 
        process.env.MINIFY === 'true' || 
        process.argv.includes('--minify');
    const minifyFlag = isProd ? '--minify' : '';
    const webpackMode = isProd ? 'production' : 'development';
    const clearFlag = process.argv.includes('--clear') ? '--clear' : '';

    // Use tsx to run the CLI from source for internal builds. 
    // This avoids using a potentially broken dist/index.mjs to perform the build.
    const targets = ['src', 'api', 'build', 'examples'];
    const buildArgs = ['build', ...targets];
    if (clearFlag) buildArgs.push('--clear');
    if (minifyFlag) buildArgs.push('--minify');

    console.log('\x1b[36m%s\x1b[0m', `>>> Running CLI build for: ${targets.join(', ')}...`);
    execSync(`npx tsx src/cli/index.ts ${buildArgs.join(' ')}`, { stdio: 'inherit' });

    // 2. Generate Type Definitions (Matches compile:all result)
    // We omit --rootDir to allow tsc to find all source files defined in tsconfig.json
    console.log('\x1b[36m%s\x1b[0m', '>>> Generating comprehensive type definitions...');
    execSync('npx tsc --emitDeclarationOnly --outDir dist', { stdio: 'inherit' });

    // 3. Always ensure a fresh CLI compilation for the package distribution
    console.log('\x1b[36m%s\x1b[0m', '>>> Compiling CLI distribution bundle...');
    execSync('npm run compile', { stdio: 'inherit' });

    // 4. Bundling CDN Runtimes
    console.log('\x1b[36m%s\x1b[0m', '>>> Bundling CDN Assets (Standard & Compatibility)...');
    
    // Build the Compatibility Bundle (dist/cdn/can.compat.min.js)
    execSync(`npx webpack --config webpack.config.cdn.cjs --mode ${webpackMode}`, { stdio: 'inherit' });
    
    // Build the Production Bundle (build/cdn/can.prod.min.js via config2)
    execSync(`npx webpack --config webpack.config.cdn2.cjs --mode ${webpackMode}`, { stdio: 'inherit' });

    // Run modern CDN builder if the script exists
    const modernBuilder = path.resolve(__dirname, 'cdn/build-cdn.js');
    if (fs.existsSync(modernBuilder)) {
        console.log('\x1b[36m%s\x1b[0m', '>>> Building modern CDN distribution...');
        execSync(`node ${modernBuilder}`, { stdio: 'inherit' });
    }

    console.log('\x1b[32m%s\x1b[0m', '>>> Framework built successfully!');
} catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '>>> Build failed with the following error:');
    if (error.stderr) {
        console.error(error.stderr.toString());
    } else {
        console.error(error.message || error);
    }
    process.exit(1);
}