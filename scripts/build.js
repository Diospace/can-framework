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

     // 1. Always ensure a fresh CLI compilation for the package distribution
    console.log('\x1b[36m%s\x1b[0m', '>>> Compiling CLI distribution bundle...');
    execSync('npm run compile', { stdio: 'inherit' });

    // 2. Run Type Checking
    console.log('\x1b[36m%s\x1b[0m', '>>> Running type check...');
    execSync('npm run type-check', { stdio: 'inherit' });

    // Determine if we should minify based on environment variables
    const isProd = 
        process.env.NODE_ENV === 'production' || 
        process.env.MINIFY === 'true' || 
        process.argv.includes('--minify');
    const minifyFlag = isProd ? '--minify' : '';
    const webpackMode = isProd ? 'production' : 'development';

    // Use tsx to run the CLI from source for internal builds. 
    // This avoids using a potentially broken dist/index.mjs to perform the build.
    execSync(`npx tsx src/cli/index.ts build src api build --clear ${minifyFlag}`, { stdio: 'inherit' });

    console.log('\x1b[36m%s\x1b[0m', '>>> Bundling CDN Runtime Compiler (Output: dist/cdn)...');
    // Execute webpack with the appropriate mode
    execSync(`npx webpack --config webpack.config.cdn.cjs --mode ${webpackMode}`, { stdio: 'inherit' });

    console.log('\x1b[32m%s\x1b[0m', '>>> Framework built successfully!');
} catch (error) {
    process.exit(1);
}