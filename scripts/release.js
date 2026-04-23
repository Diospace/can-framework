const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Handles the production release sequence.
 */
async function release() {
    console.log('\x1b[33m%s\x1b[0m', '>>> Preparing for release...');

    try {
        // 1. Check for uncommitted changes (Safety check)
        const status = execSync('git status --porcelain').toString();
        if (status) {
            console.error('\x1b[31m%s\x1b[0m', 'Error: You have uncommitted changes. Please commit or stash them before releasing.');
            process.exit(1);
        }

        // 2. Run a full clean build
        console.log('--- Compiling production assets...');
        execSync('node scripts/build.js', { 
            stdio: 'inherit', 
            env: { ...process.env, NODE_ENV: 'production' } 
        });

        // 3. Placeholder for tests
        // execSync('npm test', { stdio: 'inherit' });

        console.log('\x1b[32m%s\x1b[0m', '>>> Release preparation complete. Ready to publish!');
    } catch (err) {
        process.exit(1);
    }
}

release();