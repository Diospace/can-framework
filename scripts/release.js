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
    console.log('\x1b[33m%s\x1b[0m', '>>> Preparing for release...');

    try {
        // 0. Check authentication before starting
        try {
            const user = execSync('npm whoami', { stdio: 'pipe' }).toString().trim();
            console.log(`\x1b[36mLogged in as: ${user}\x1b[0m`);
        } catch (e) {
            console.error('\x1b[31m%s\x1b[0m', 'Error: You are not logged into npm. Please run "npm login" first.');
            process.exit(1);
        }

        
        // 0. Safety Check: Ensure we are on the main branch
        const isForce = process.argv.includes('--force');
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

        // 2. Run a full clean build
        console.log('--- Step 1: Compiling core library...');
        // execSync('node scripts/build.js', { 
        //     stdio: 'inherit', 
        //     env: { ...process.env, NODE_ENV: 'production' } 
        // });
       execSync('npm run build', { 
            stdio: 'inherit', 
            env: { ...process.env, NODE_ENV: 'production' } 
        });

        // 2.0 Compile CLI distribution bundle
        console.log('--- Step 2: Compiling CLI distribution bundle...');
        execSync('npm run compile', { 
            stdio: 'inherit', 
            env: { ...process.env, NODE_ENV: 'production' } 
        });
    
        // 2.1 Compile individual modules and Type Definitions
        // This is critical for IntelliSense and Tree-shaking in the NPM package.
        console.log('--- Step 3: Generating individual modules and types...');
        execSync('npm run compile:all', { 
            stdio: 'inherit', 
            env: { ...process.env, NODE_ENV: 'production' } 
        });

        // 3. Placeholder for tests
        // execSync('npm test', { stdio: 'inherit' });

        // 4. Final Publish
        console.log('--- Publishing to NPM...');
        execSync('npm publish --access public', { stdio: 'inherit' });

        // 5. Sync Git Tag
        const pkgPath = path.resolve(__dirname, '../package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
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