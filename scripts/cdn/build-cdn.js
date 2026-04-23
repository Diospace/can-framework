const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const entryPoint = path.join(__dirname, 'cdn.ts');
const outDir = path.join(__dirname, '../../dist/cdn');

async function build() {
    console.log('📦 Bundling for CDN...');

    try {
        // 1. Global Bundle (IIFE) - for <script src="...">
        // This creates a global variable 'Can' containing all your exports
        await esbuild.build({
            entryPoints: [entryPoint],
            bundle: true,
            outfile: path.join(outDir, 'can.global.min.js'),
            format: 'iife',
            minify: true,
            sourcemap: true,
            target: ['es2020', 'chrome80', 'firefox75', 'safari13'],
        });
        console.log(`  ✅ ${path.relative(process.cwd(), outDir)}/can.global.min.js (window.Can)`);

        // 2. ESM Bundle - for <script type="module">
        await esbuild.build({
            entryPoints: [entryPoint],
            bundle: true,
            outfile: path.join(outDir, 'can.esm.js'),
            format: 'esm',
            minify: true,
            sourcemap: true,
            target: ['es2020', 'chrome80', 'firefox75', 'safari13'],
        });
        console.log(`  ✅ ${path.relative(process.cwd(), outDir)}/can.esm.js (ES Module)`);

        reportSizes();

    } catch (e) {
        console.error('Build failed:', e);
        process.exit(1);
    }
}

/**
 * Compares and reports file sizes of the generated CDN bundles.
 */
function reportSizes() {
    const files = [
        'can.compat.min.js',
        'can.global.min.js',
        'can.esm.js'
    ];

    console.log('\n\x1b[36m%s\x1b[0m', '📊 CDN Bundle Size Report:');
    console.log('-------------------------------------------');
    
    files.forEach(file => {
        const filePath = path.join(outDir, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            
            // Color coding: Compat is usually larger (yellow), Modern is smaller (green)
            const color = file.includes('compat') ? '\x1b[33m' : '\x1b[32m';
            const label = file.padEnd(20);
            
            console.log(`${label} │ ${color}${sizeKB} KB\x1b[0m`);
        }
    });
    console.log('-------------------------------------------');
}

build();

// run this "node scripts/cdn/build-cdn.js"