// const { execSync } = require('child_process');
// const fs = require('fs');
// const path = require('path');

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Handles the production release sequence.
 */
async function release() {
    const pkgPath = path.resolve(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const isDryRun = process.argv.includes('--dry-run');
    const isForce = process.argv.includes('--force');

    console.log('\x1b[33m%s\x1b[0m', `>>> Preparing for release of ${pkg.name} v${pkg.version}...`);

    try {
        // 0. Check authentication before starting
        try {
            const user = execSync('npm whoami', { stdio: 'pipe' }).toString().trim();
            console.log(`\x1b[36mNPM Account: ${user}\x1b[0m`);
        } catch (e) {
            console.error('\x1b[31m%s\x1b[0m', 'Error: You are not logged into npm. Please run "npm login" first.');
            process.exit(1);
        }

        
        // 0. Safety Check: Ensure we are on the main branch
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        if (branch !== 'main' && !isForce) {
            console.error('\x1b[31m%s\x1b[0m', `Error: You are on branch "${branch}". Releases should only be made from "main".`);
            console.log('To bypass this check, run: npm run release -- --force');
            process.exit(1);
        }

        // 1. Check for uncommitted changes (Safety check) - Bypass with --force
        const status = execSync('git status --porcelain').toString();
        if (status && !isForce) {
            console.error('\x1b[31m%s\x1b[0m', 'Error: You have uncommitted changes. Please commit or stash them before releasing.');
            console.log('\x1b[33mUncommitted files:\n\x1b[0m' + status);
            console.log('To bypass this check, run: npm run release -- --force');
            process.exit(1);
        }

        // 2. Run the unified build process (Handles compile:all and CDN assets internally)
        console.log('--- Step 1: Generating distribution build (non-minified)...');
        execSync('npm run build -- --clear', { 
            stdio: 'inherit', 
            env: { ...process.env, NODE_ENV: 'development' } 
        });

        // 2. Run tests (Step numbering shifted)
        console.log('--- Step 2: Running test suite...');
        execSync('npm test', { stdio: 'inherit' });

        if (isDryRun) {
            console.log('\x1b[32m%s\x1b[0m', '>>> Dry run complete. No changes were published or pushed.');
            return;
        }

        // 4. Final Publish
        console.log('--- Publishing to NPM...');
        execSync('npm publish --access public', { stdio: 'inherit' });

        // 5. Sync Git Tag
        const tagName = `v${pkg.version}`;
        
        console.log(`--- Syncing Git tag ${tagName}...`);
        const tagExists = execSync(`git tag -l ${tagName}`).toString().trim();
        
        if (tagExists) {
            console.log(`\x1b[33mWarning: Tag ${tagName} already exists. Skipping tag creation.\x1b[0m`);
        } else {
            execSync(`git tag ${tagName}`, { stdio: 'inherit' });
            console.log(`--- Tag ${tagName} created.`);
        }

         // 6. Push changes to trigger GitHub Actions
        console.log('--- Pushing to GitHub...');
        execSync(`git push origin main`, { stdio: 'inherit' });
        execSync(`git push origin ${tagName}`, { stdio: 'inherit' });

    

        console.log('\x1b[32m%s\x1b[0m', '>>> Framework successfully published to NPM!');
        // console.log('\x1b[32m%s\x1b[0m', `>>> Version ${tagName} pushed successfully!`);
        // console.log('\x1b[36m%s\x1b[0m', 'GitHub Actions will now handle the NPM publish with provenance.');
 
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', '>>> Release process encountered an error:');
        console.error(err.stderr ? err.stderr.toString() : err.message);
        process.exit(1);
    }
}

release();