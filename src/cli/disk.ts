import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively calculates the total size of a directory.
 */
async function getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;
    if (!fs.existsSync(dirPath)) {
        return 0;
    }

    const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
            totalSize += await getDirectorySize(fullPath);
        } else if (file.isFile()) {
            const stats = await fs.promises.stat(fullPath);
            totalSize += stats.size;
        }
    }
    return totalSize;
}

/**
 * Formats bytes into a human-readable string (e.g., KB, MB, GB).
 */
function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function disk() {
    console.log('\n\x1b[36m[Can Disk]\x1b[0m Analyzing project disk usage...');
    const cwd = process.cwd();

    const distSize = await getDirectorySize(path.join(cwd, 'dist'));
    const publicSize = await getDirectorySize(path.join(cwd, 'public'));
    const srcSize = await getDirectorySize(path.join(cwd, 'src'));

    console.log(`\n  \x1b[33mDist/ (Build Output):\x1b[0m ${formatBytes(distSize)}`);
    console.log(`  \x1b[33mPublic/ (Static Assets):\x1b[0m ${formatBytes(publicSize)}`);
    console.log(`  \x1b[33mSrc/ (Source Code):\x1b[0m ${formatBytes(srcSize)}`);
    console.log(`\n  \x1b[32mTotal Project Size (excluding node_modules):\x1b[0m ${formatBytes(distSize + publicSize + srcSize)}`);
}