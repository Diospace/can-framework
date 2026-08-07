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
    const paths = [path.resolve(__dirname, '../../templates'), path.resolve(__dirname, 'templates')];
    const existingPath = paths.find(p => fs.existsSync(p));
    return existingPath || paths[0];
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

    if (!command) {
        showHelp();
        return;
    }

    switch (command) {
        case 'build':
            const { build } = await import('./build');
            const targets = args.slice(1).filter(arg => !arg.startsWith('--'));
            await build(targets.length > 0 ? targets : undefined);
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
            const port = parsePort(args[1], showServeHelp);
            await serve(port);
            break;
        case 'preview':
            const { serve: serveProd } = await import('./serve');
            const previewPort = parsePort(args[1], showServeHelp);
            await serveProd(previewPort, true);
            break;
        case 'disk':
            const { disk } = await import('./disk');
            await disk();
            break;
        case 'optimize':
            const { optimize } = await import('../runtime-dom/optimize');
            await optimize(args[1] || cwd);
            break;
        default:
            showHelp();
    }
}

function showHelp() {
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
    console.log('  \x1b[36mdisk\x1b[0m           Analyze project disk usage');
    console.log('  \x1b[36moptimize [dir]\x1b[0m Pre-compile template expressions for production\n');
}

/**
 * Parses a CLI port argument, tolerating help flags and invalid values.
 * A missing/invalid port falls back to the default (3000).
 */
function parsePort(raw: string | undefined, help: () => void): number {
    if (!raw || raw === '--help' || raw === '-h') {
        help();
    }
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isNaN(parsed) || parsed < 0 || parsed > 65535 ? 3000 : parsed;
}

function showServeHelp() {
    console.log('\x1b[32mUsage:\x1b[0m can serve [port]   (default: 3000)\n');
    console.log('  Starts the development server with HMR, serving the compiled app at http://localhost:<port>');
    console.log('  \x1b[36mserve --help\x1b[0m       Show this help text\n');
}

run().catch(err => {
    console.error('\x1b[31m[CLI Error]:\x1b[0m', err);
    process.exit(1);
});