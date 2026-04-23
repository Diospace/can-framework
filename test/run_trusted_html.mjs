import fs from 'fs';
import { TrustedHtml } from '../dist/examples/TrustedHtml.mjs';

console.log('--- Starting Trusted HTML Demo ---');

// Instantiate the component
const app = new TrustedHtml();
app.mount();

// Render to HTML
console.log('Rendering to trusted_html.html...');
const htmlContent = app.render();

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Can Trusted HTML Demo</title>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

fs.writeFileSync('trusted_html.html', fullHtml);
console.log('Successfully generated trusted_html.html');