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
        case 'ssg':
            const { ssg } = await import('./ssg');
            await ssg(args[1]);
            break;
        case 'serve':
            const { serve } = await import('./serve');
            const port = args[1] ? parseInt(args[1]) : 3000;
            await serve(port);
            break;
        case 'preview':
            const { serve: serveProd } = await import('./serve');
            const previewPort = args[1] ? parseInt(args[1]) : 3000;
            await serveProd(previewPort, true);
            break;
        case 'disk':
            const { disk } = await import('./disk');
            await disk();
            break;
        default:
            console.log('\n\x1b[32m@decaspace/can-framework CLI\x1b[0m');
            console.log('Usage: npx @decaspace/can-framework <command> [arguments]\n');
            console.log('Commands:');
            console.log('  \x1b[36mcreate <name>\x1b[0m  Scaffold a new Can project');
            console.log('  \x1b[36mbuild\x1b[0m          Build for production');
            console.log('  \x1b[36mdev\x1b[0m            Watch for changes and rebuild (development)');
            console.log('  \x1b[36mserve [port]\x1b[0m   Start development server with HMR (default: 3000)\n');
            console.log('  \x1b[36mssg\x1b[0m            Generate static HTML files');
            console.log('  \x1b[36mpreview [port]\x1b[0m Start production preview server (default: 3000)\n');
            console.log('  \x1b[36mdisk\x1b[0m           Analyze project disk usage\n');
    }
}

run().catch(err => console.error('\x1b[31m[CLI Error]:\x1b[0m', err));