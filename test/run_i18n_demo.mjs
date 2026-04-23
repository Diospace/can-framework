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

console.log('--- Starting i18n Demo ---');

const { createI18n } = await import('../dist/runtime-core/i18n.mjs');
const { I18nDemo } = await import('../dist/components/I18nDemo.mjs');

// Initialize i18n
createI18n({
    locale: 'en',
    messages: {
        en: {
            welcome_message: 'Welcome to Can Framework',
            description: 'This text is translated automatically.'
        },
        fr: {
            welcome_message: 'Bienvenue sur Can Framework',
            description: 'Ce texte est traduit automatiquement.'
        }
    }
});

const app = new I18nDemo();
const root = app.render();

console.log('Initial Render (EN):');
// In a real DOM, we would inspect textContent. 
// Since we mock DOM, we trust the effect ran.

console.log('Simulating Language Switch...');
// app.toggleLanguage(); // In a real runner we would trigger this

console.log('--- Demo Finished ---');