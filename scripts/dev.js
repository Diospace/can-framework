//const { execSync } = require('child_process');
import {execSync} from 'child_process'

/**
 * Starts the Can Framework development environment.
 */
console.log('\x1b[35m%s\x1b[0m', '>>> Launching Dev Server...');

try {
    // Calls the 'dev' command which triggers serve.ts logic
    execSync('node dist/index.mjs dev', { stdio: 'inherit' });
} catch (error) {
    // Dev server stopped
    process.exit(0);
}