import fs from 'fs';
import { App } from '../dist/examples/app.mjs';

console.log('--- Starting Can Framework Demo ---');

// Instantiate the App component
const app = new App();

// Simulate the lifecycle
app.mount();

// Render to HTML
console.log('Rendering to index.html...');
const htmlContent = app.render();

// Read devtools mock script
let devtoolsScript = '';
try {
    devtoolsScript = fs.readFileSync('mock_devtools.js', 'utf-8');
} catch (e) {
    console.warn('Warning: mock_devtools.js not found.');
}

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Can Framework Demo</title>
    <style>
        body { font-family: sans-serif; padding: 2rem; }
        .btn { padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    </style>
    <script>
        ${devtoolsScript}
    </script>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

fs.writeFileSync('index.html', fullHtml);
console.log('Successfully generated index.html');

console.log('--- Demo Finished ---');