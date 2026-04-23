// Mock DOM environment for Node.js execution
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
        appendChild(child) { this.children.push(child); }
    }),
    createTextNode: (text) => ({ nodeType: 3, text, data: text }),
    head: { appendChild: () => {} }
};

// Mock window for devtools check
global.window = {};

console.log('--- Starting Signal Demo (Fine-Grained) ---');

// Import the compiled component (ensure you run 'npm run compile' first)
const { SignalDemo } = await import('../dist/components/SignalDemo.mjs');

const app = new SignalDemo();

// In the new architecture, render() returns a DOM Node directly
const root = app.render();

console.log('Rendered DOM Structure:');
console.log(JSON.stringify(root, (key, value) => {
    if (key === 'children' && value.length === 0) return undefined;
    return value;
}, 2));

console.log('\n✅ Component rendered successfully using imperative DOM operations.');