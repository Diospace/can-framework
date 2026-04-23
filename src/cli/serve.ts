import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { build } from './build';

export async function serve(port: number = 3000) {
    // Initial build
    await build();

    const clients: http.ServerResponse[] = [];

    const server = http.createServer((req, res) => {
        // 1. Handle HMR / Live Reload connection
        if (req.url === '/_hmr') {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });
            clients.push(res);

            // Remove client when connection closes to prevent memory leaks
            req.on('close', () => {
                const index = clients.indexOf(res);
                if (index !== -1) clients.splice(index, 1);
            });
            return;
        }

        // 2. Serve Static Files from the build output directory (dist)
        const distDir = path.join(process.cwd(), 'dist');
        const urlPath = req.url === '/' ? '/index.html' : req.url!;
        const filePath = path.join(distDir, urlPath);

        const extname = path.extname(filePath);
        const mimeTypes: Record<string, string> = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.mjs': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
        };
        const contentType = mimeTypes[extname] || 'text/plain';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if(error.code == 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server Error: '+error.code);
                }
            } else {
                // Inject HMR script into HTML
                if (contentType === 'text/html') {
                    // Read mock devtools script
                    let mockScript = '';
                    try {
                        const mockPath = path.resolve(process.cwd(), 'test/mock_devtools.js');
                        if (fs.existsSync(mockPath)) {
                            const mockContent = fs.readFileSync(mockPath, 'utf-8');
                            mockScript = `<script>${mockContent}</script>`;
                        }
                    } catch (e) {
                        console.warn('[DevServer] Could not load mock devtools:', e);
                    }

                    const hmrScript = `
                    <script>
                        console.log('%c[Can HMR]%c Connected', 'color: #42b883; font-weight: bold', '');
                        new EventSource('/_hmr').onmessage = (e) => {
                            try {
                                const payload = JSON.parse(e.data);
                                if (payload.type === 'style-update') {
                                    console.log('%c[Can HMR]%c Style update: ' + payload.url, 'color: #42b883; font-weight: bold', '');
                                    // Attempt to re-import the module to trigger style injection
                                    // We use a timestamp to bypass the browser cache
                                    import(payload.url + '?t=' + Date.now()).catch(err => {
                                        // If re-import fails (e.g., custom element re-definition error), 
                                        // fallback to full reload
                                        if (err.name === 'NotSupportedError' || err.message.includes('already been used')) {
                                           console.log('%c[Can HMR]%c Logic changed, triggering full reload...', 'color: #e67e22; font-weight: bold', '');
                                           location.reload();
                                        } else {
                                            console.warn('[HMR] Style update failed, reloading...', err);
                                            location.reload();
                                        }
                                    });
                                } else {
                                    location.reload();
                                }
                            } catch {
                                location.reload();
                            }
                        };
                    </script>`;

                    // Automatically inject the entry point script if not present
                    const entryScript = content.toString().includes('main.mjs') 
                        ? '' 
                        : '<script type="module" src="/main.mjs"></script>';

                    const html = content.toString().replace('</body>', entryScript + mockScript + hmrScript + '</body>');
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(html, 'utf-8');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            }
        });
    });

    server.listen(port, () => {
        console.log(`Dev server running at http://localhost:${port}`);
    });

    // 3. Watch for changes
    let timeout: NodeJS.Timeout;
    const cwd = process.cwd();
    const dirsToWatch = [path.join(cwd, 'src'), path.join(cwd, 'examples')];

    dirsToWatch.forEach(watchDir => {
        if (fs.existsSync(watchDir)) {
            fs.watch(watchDir, { recursive: true }, (event, filename) => {
                if (!timeout) {
                    timeout = setTimeout(async () => {
                        const fullPath = path.join(watchDir, filename || '');
                        const relativePath = path.relative(cwd, fullPath);
                        console.log(`\n[Watch] Change: ${relativePath}`);
                        try {
                            await build(relativePath);
                            
                            // Map source path to served URL
                            let url = '/' + path.relative(cwd, fullPath).replace(/\\/g, '/');
                            // Adjust for src flattening in dist
                            if (url.startsWith('/src/')) url = url.replace('/src/', '/');
                            if (url.endsWith('.can')) url = url.replace('.can', '.mjs');
                            if (url.endsWith('.ts')) url = url.replace('.ts', '.mjs');
                            
                            // Check if the change is in a .can file (which contains styles)
                            const isStyleCandidate = filename?.endsWith('.can');
                            const payload = {
                                type: isStyleCandidate ? 'style-update' : 'reload',
                                url: url
                            };
                            clients.forEach(res => res.write(`data: ${JSON.stringify(payload)}\n\n`));
                        } catch (e) {
                            console.error('[Watch] Build failed:', e);
                        }
                        timeout = null!;
                    }, 100); // Debounce
                }
            });
        }
    });
}
