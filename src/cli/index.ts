#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve the templates directory relative to the CLI location.
 * It checks the project root (production) and the local directory (development).
 */
const getTemplatesDir = () => {
    const rootPath = path.resolve(__dirname, '../../templates');
    const localPath = path.resolve(__dirname, 'templates');
    return fs.existsSync(rootPath) ? rootPath : localPath;
};

const TEMPLATES_DIR = getTemplatesDir();
const PKG_PATH = path.resolve(__dirname, '../../package.json');

// Load framework metadata
const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf-8'));

/**
 * Entry point for the Can Framework CLI.
 * Automatically detects if it should run from source (TS) or distribution (JS).
 */
async function run() {
    const args = process.argv.slice(2);
    const command = args[0];
    const cwd = process.cwd();

    if (args.includes('--version') || args.includes('-v')) {
        console.log(`v${pkg.version}`);
        return;
    }

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
            
            // Verify that the templates directory exists before proceeding
            if (!fs.existsSync(TEMPLATES_DIR)) {
                console.error(`\x1b[31m[CLI Error]:\x1b[0m Templates directory not found at: ${TEMPLATES_DIR}`);
                console.error('Ensure that the "templates" folder is included in the package distribution.');
                process.exit(1);
            }

            create(args[1], TEMPLATES_DIR, pkg.version);
            break;
        case 'add':
            const { add } = await import('./add');
            await add(args[1], args[2]);
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
            console.log(`Version: ${pkg.version}`);
            console.log('Usage: can <command> [arguments]\n');
            console.log('Commands:');
            console.log('  \x1b[36mcreate <name>\x1b[0m  Scaffold a new Can project');
            console.log('  \x1b[36madd [type] <name>\x1b[0m Generate a new component (default) or api route');
            console.log('  \x1b[36mbuild\x1b[0m          Build for production');
            console.log('  \x1b[36mdev\x1b[0m            Start development server with HMR');
            console.log('  \x1b[36mserve [port]\x1b[0m   Start development server with HMR (default: 3000)\n');
            console.log('  \x1b[36mssg\x1b[0m            Generate static HTML files');
            console.log('  \x1b[36mpreview [port]\x1b[0m Start production preview server (default: 3000)\n');
            console.log('  \x1b[36mdisk\x1b[0m           Analyze project disk usage\n');
    }
}

run().catch(err => console.error('\x1b[31m[CLI Error]:\x1b[0m', err));