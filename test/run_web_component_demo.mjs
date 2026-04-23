// Mock DOM environment
global.HTMLElement = class HTMLElement {
    constructor() {
        this.shadowRoot = null;
    }
    attachShadow(init) {
        this.shadowRoot = {
            innerHTML: '',
            children: [],
            appendChild(child) { this.children.push(child); }
        };
        return this.shadowRoot;
    }
};

global.customElements = {
    define(name, constructor) {
        console.log(`[CustomElements] Defined <${name}>`);
        global.customElements[name] = constructor;
    },
    get(name) { return global.customElements[name]; }
};

global.document = {
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
    querySelector: () => null
};

console.log('--- Starting Web Component Demo ---');

const { defineCustomElement } = await import('../dist/runtime-dom/customElement.mjs');
const { WebComponentDemo } = await import('../dist/components/WebComponentDemo.mjs');

// 1. Define Custom Element
const MyElement = defineCustomElement(WebComponentDemo, { props: ['msg'] });
customElements.define('my-element', MyElement);

// 2. Instantiate and Mount
const el = new MyElement();
el.attributeChangedCallback('msg', null, 'Hello from Attribute');
el.connectedCallback();

console.log('--- Demo Finished ---');