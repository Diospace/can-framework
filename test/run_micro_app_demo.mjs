// Mock DOM environment with Shadow DOM support
global.document = {
    createDocumentFragment: () => ({
        nodeType: 11,
        children: [],
        appendChild(child) { this.children.push(child); }
    }),
    createElement: (tag) => ({
        nodeType: 1,
        tag,
        attributes: {},
        children: [],
        setAttribute(k, v) { this.attributes[k] = v; },
        addEventListener() {},
        appendChild(child) { this.children.push(child); },
        // Mock Shadow DOM
        attachShadow(mode) {
            console.log(`[DOM] Attached Shadow Root (${JSON.stringify(mode)})`);
            return {
                children: [],
                appendChild(child) { this.children.push(child); }
            };
        }
    }),
    createTextNode: (text) => ({ nodeType: 3, text, data: text }),
    getElementById: (id) => ({
        id,
        attachShadow: (mode) => ({
            children: [],
            appendChild(child) { 
                console.log(`[ShadowDOM] Appended child to ${id}`);
            }
        }),
        appendChild: () => {}
    }),
    querySelector: () => null,
    head: { appendChild: () => {} }
};

global.window = {};

console.log('--- Starting Micro-Frontend Demo ---');

const { MicroAppDemo } = await import('../dist/components/MicroAppDemo.mjs');

const app = new MicroAppDemo();
const root = app.render();

// Simulate mount to trigger micro app creation
app.mount();

console.log('--- Demo Finished ---');