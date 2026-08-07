import { createApp } from "./apiCreateApp.mjs";
class EventBridge {
    constructor() {
        this.listeners = {};
    }
    on(event, fn) {
        if (!this.listeners[event])
            this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
    emit(event, payload) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(fn => fn(payload));
        }
    }
    off(event, fn) {
        if (!this.listeners[event])
            return;
        this.listeners[event] = this.listeners[event].filter(f => f !== fn);
    }
}
export function createMicroApp(options) {
    const bridge = new EventBridge();
    // Create isolated app instance
    const app = createApp(options.rootComponent);
    // Inject bridge into micro-app context
    app.provide('bridge', bridge);
    // Provide props if available
    if (options.props) {
        app.provide('microAppProps', options.props);
    }
    let container = typeof options.mount === 'string'
        ? document.querySelector(options.mount)
        : options.mount;
    if (container && options.scopeCSS && container.attachShadow) {
        // Use Shadow DOM for CSS isolation
        const shadowRoot = container.shadowRoot || container.attachShadow({ mode: 'open' });
        // We need a root element inside shadow DOM to mount the app
        const root = document.createElement('div');
        root.id = `micro-app-${options.name}`;
        shadowRoot.appendChild(root);
        // Override mount logic for this specific app instance if needed, 
        // but standard mount works if we pass the element.
        app.mount(root);
    }
    else if (container) {
        app.mount(container);
    }
    return {
        app,
        bridge,
        unmount: () => {
            // Cleanup logic would go here
            if (container) {
                if (options.scopeCSS && container.shadowRoot) {
                    container.shadowRoot.innerHTML = '';
                }
                else {
                    container.innerHTML = '';
                }
            }
        }
    };
}
//# sourceMappingURL=microApp.mjs.map