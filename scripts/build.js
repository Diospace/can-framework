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

const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('--minify');
const webpackMode = isProd ? 'production' : 'development';
const minifyFlag = isProd ? '--minify' : '';


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



    // Always purge dist: the downstream "can build" step is incremental (mtime-based)
    // and can silently skip stale outputs, which would publish a broken package.
    const distPath = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
        console.log('\x1b[33m%s\x1b[0m', '>>> Purging dist directory for a guaranteed clean build...');
        fs.rmSync(distPath, { recursive: true, force: true });
    }

    // 3. Run the comprehensive compilation (compile:all)
    // This processes framework components (src, api, build, examples) and generates type definitions.
    console.log('\x1b[36m%s\x1b[0m', '>>> Running full compilation (npm run compile:all)...');
    // execSync('npm run compile:all', { stdio: 'inherit' });
    execSync(`npm run compile:all -- ${minifyFlag}`, { stdio: 'inherit' });


    // 4. Always ensure a fresh CLI compilation for the package distribution
    console.log('\x1b[36m%s\x1b[0m', '>>> Compiling CLI distribution bundle...');
    //execSync('npm run compile', { stdio: 'inherit' });
    execSync(`npm run compile -- ${minifyFlag}`, { stdio: 'inherit' });


    // 5. Bundling CDN Runtimes (Forcing development mode to disable minification)
    console.log('\x1b[36m%s\x1b[0m', '>>> Bundling CDN Assets (Standard & Compatibility)...');
    // execSync('npx webpack --config webpack.config.cdn.cjs --mode development', { stdio: 'inherit' });
    // execSync('npx webpack --config webpack.config.cdn2.cjs --mode development', { stdio: 'inherit' });
    
    // 5. Bundling CDN Runtimes
    execSync(`npx webpack --config webpack.config.cdn.cjs --mode ${webpackMode}`, { stdio: 'inherit' });
    execSync(`npx webpack --config webpack.config.cdn2.cjs --mode ${webpackMode}`, { stdio: 'inherit' });

    
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