#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);

/**
 * Entry point for the Can Framework CLI.
 * Automatically detects if it should run from source (TS) or distribution (JS).
 */
async function run() {
    const args = process.argv.slice(2);
    const command = args[0];
    const cwd = process.cwd();

    // 1. Source Detection: Check if we are running inside the framework's repository.
    // We check for 'src/compiler/codegen.ts' to verify this is the framework source.
    const isFrameworkSource = fs.existsSync(path.join(cwd, 'src', 'compiler', 'codegen.ts'));
    
    // 2. Execution Mode: Are we already running via a TypeScript loader (like tsx)?
    const isRunningTs = __filename.endsWith('.ts');

    if (isFrameworkSource && !isRunningTs) {
        const tsxPath = path.join(cwd, 'node_modules', '.bin', 'tsx');
        const sourceEntry = path.join(cwd, 'src', 'cli', 'index.ts');

        if (fs.existsSync(tsxPath) && fs.existsSync(sourceEntry)) {
            console.log('\x1b[33m[Can CLI]\x1b[0m Framework source detected. Running via tsx...');
            const child = spawn(tsxPath, [sourceEntry, ...args], { 
                stdio: 'inherit', 
                shell: true 
            });
            child.on('exit', (code) => process.exit(code || 0));
            return;
        }
    }

    // 3. Command Dispatcher: Execute the logic
    switch (command) {
        case 'build':
            const { build } = await import('./build');
            await build(args[1]);
            break;
        case 'dev':
            const { dev } = await import('./dev');
            await dev();
            break;
        case 'create':
            const { create } = await import('./create');
            create(args[1]);
            break;
        default:
            console.log('\n\x1b[32mCan Framework CLI\x1b[0m');
            console.log('Usage: can <command> [arguments]\n');
            console.log('Commands:');
            console.log('  \x1b[36mcreate <name>\x1b[0m  Scaffold a new Can project');
            console.log('  \x1b[36mbuild\x1b[0m          Build for production');
            console.log('  \x1b[36mdev\x1b[0m            Start dev server with HMR\n');
    }
}

run().catch(err => console.error('\x1b[31m[CLI Error]:\x1b[0m', err));