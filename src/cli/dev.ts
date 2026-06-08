import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { build } from './build';

/**
 * Dev script: Watches for changes and performs incremental builds.
 * This provides a smooth development experience by re-compiling only changed files.
 */
export async function dev() {
    const cwd = process.cwd();
    const srcDir = path.join(cwd, 'src');
    const examplesDir = path.join(cwd, 'examples');
    const apiDir = path.join(cwd, 'api');
    const buildDir = path.join(cwd, 'build');

    console.log('[Can Dev] Starting dev mode...');

    // 1. Initial full build to ensure the dist directory is synchronized
    await build();

    const dirsToWatch = [
        { path: srcDir, name: 'src/' },
        { path: examplesDir, name: 'examples/' },
        { path: apiDir, name: 'api/' },
        { path: buildDir, name: 'build/' }
    ];

    const existingDirs = dirsToWatch.filter(d => fs.existsSync(d.path));
    console.log(`[Can Dev] Watching for changes in: ${existingDirs.map(d => d.name).join(', ')}`);

    let timeout: NodeJS.Timeout | null = null;

    const handleEvent = async (fullPath: string) => {
        // Ensure the file still exists (prevents crashes on deletions)
        if (!fs.existsSync(fullPath)) return;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            // Ignore non-source files and type definitions
            const ext = path.extname(fullPath);
            if ((ext !== '.can' && ext !== '.ts') || fullPath.endsWith('.d.ts')) return;

            // Calculate path relative to project root so the build function can resolve it correctly
            const relativePath = path.relative(cwd, fullPath);
            console.log(`[Can Dev] Change detected: ${relativePath}. Rebuilding...`);

            try {
                // Trigger the incremental build logic already present in build.ts
                await build([relativePath]);
            } catch (err) {
                console.error(`[Can Dev] Build failed for ${relativePath}:`, err);
            }
            timeout = null;
        }, 100); // 100ms debounce to batch rapid filesystem events
    };

    const watchOptions = { recursive: true };

    // Setup native filesystem watchers
    existingDirs.forEach(d => {
        fs.watch(d.path, watchOptions, (event, filename) => filename && handleEvent(path.join(d.path, filename)));
    });
}