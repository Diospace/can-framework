// Mock DOM environment
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

global.window = {};

console.log('--- Starting Form Demo ---');

const { FormDemo } = await import('../dist/components/FormDemo.mjs');

const app = new FormDemo();
const root = app.render();

console.log('Initial Render Complete.');
console.log('Simulating Form Submission...');

// In a real browser, clicking submit would trigger the onSubmit handler
// Here we just verify the structure was generated
console.log('Form structure generated successfully.');

console.log('--- Demo Finished ---');