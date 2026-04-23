import * as fs from 'fs';
import * as path from 'path';
import { renderToString } from '../server-renderer/index';

import { createStore } from '../store/Store'; // Assuming a createStore function
/**
 * Generates static HTML by rendering the compiled Root component.
 */
export async function ssg(entryFileName: string = 'App.mjs') {
    console.log('Starting Static Site Generation...');

    try {
        const distDir = path.resolve(process.cwd(), 'dist');
        const entryPath = path.join(distDir, entryFileName);

        if (!fs.existsSync(entryPath)) {
            throw new Error(`Compiled entry point not found at ${entryPath}. Run 'build' first.`);
        }

        // Dynamically import the compiled ES module
        const module = await import('file://' + entryPath.replace(/\\/g, '/'));
        const RootComponent = module.default || Object.values(module)[0];

        // --- Store Initialization for SSR ---
        // This assumes your application has a centralized way to create/get the store.
        // For a simple example, we'll create a dummy store.
        // In a real app, you'd import your actual store setup.
        const serverStore = createStore({
            state: () => ({
                // This state would typically be populated by server-side data fetching
                // For demonstration, let's add some initial data
                ssrData: 'Data from Server',
                count: 0
            }),
            mutations: {
                increment(state) { state.count++; }
            },
            actions: {}
        });

        const appHtml = await renderToString(RootComponent, {}, serverStore);
        const initialState = JSON.stringify(serverStore.state.value);

        // Construct the full HTML document
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Can Framework App</title>
    <script>
        // Hydrate the client-side store with initial server-rendered state
        window.__INITIAL_STATE__ = ${initialState};
    </script>
</head>
<body>
    <div id="app">${appHtml}</div>
    <script type="module" src="/main.mjs"></script>
</body>
</html>`;

        // Ensure dist directory exists
        //const distDir = path.resolve(process.cwd(), 'dist');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }

        // Write the file
        const outputPath = path.join(distDir, 'index.html');
        fs.writeFileSync(outputPath, html);
        console.log(`SSG Complete: Generated ${outputPath}`);

    } catch (error) {
        console.error('SSG Failed:', error);
    }
}