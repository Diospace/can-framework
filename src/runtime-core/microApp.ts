import { createApp, App } from './apiCreateApp';

export interface MicroAppOptions {
    name: string;
    rootComponent: any;
    mount: string | HTMLElement;
    sandbox?: boolean;
    scopeCSS?: boolean;
    props?: Record<string, any>;
}

export interface MicroAppInstance {
    app: App;
    unmount: () => void;
    bridge: EventBridge;
}

class EventBridge {
    private listeners: Record<string, Function[]> = {};

    on(event: string, fn: Function) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    emit(event: string, payload?: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(fn => fn(payload));
        }
    }

    off(event: string, fn: Function) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(f => f !== fn);
    }
}

export function createMicroApp(options: MicroAppOptions): MicroAppInstance {
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

    if (container && options.scopeCSS && (container as HTMLElement).attachShadow) {
        // Use Shadow DOM for CSS isolation
        const shadowRoot = container.shadowRoot || (container as HTMLElement).attachShadow({ mode: 'open' });
        // We need a root element inside shadow DOM to mount the app
        const root = document.createElement('div');
        root.id = `micro-app-${options.name}`;
        shadowRoot.appendChild(root);
        
        // Override mount logic for this specific app instance if needed, 
        // but standard mount works if we pass the element.
        app.mount(root);
    } else if (container) {
        app.mount(container as HTMLElement);
    }

    return {
        app,
        bridge,
        unmount: () => {
            // Cleanup logic would go here
            if (container) {
                if (options.scopeCSS && container.shadowRoot) {
                    container.shadowRoot.innerHTML = '';
                } else {
                    container.innerHTML = '';
                }
            }
        }
    };
}