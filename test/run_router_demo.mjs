import fs from 'fs';
import { RouterApp } from '../dist/examples/RouterApp.mjs';

console.log('--- Starting Router Demo ---');

// Instantiate the RouterApp component
const app = new RouterApp();

// Mount (initializes router and resolves default route '/')
app.mount();

// Render to HTML
console.log('Rendering to router_demo.html...');

// Note: Since router resolution is async in our implementation, 
// in a real SSR scenario we would wait for router.isReady().
// For this simple demo, the synchronous initial render works for memory history.
const htmlContent = app.render();

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Can Router Demo</title>
    <style>body { font-family: sans-serif; padding: 2rem; } nav a { margin-right: 10px; }</style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

fs.writeFileSync('router_demo.html', fullHtml);
console.log('Successfully generated router_demo.html');
console.log('--- Demo Finished ---');