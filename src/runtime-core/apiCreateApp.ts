import { Component } from './Component';
import { getComponentTagName } from '../runtime-dom/customElement';
import { reactive } from '../reactivity/index';
import { devtools } from '../devtools';
import { Directive } from './directives/baseDirective';
import { registerDirective } from './directives/directiveRegistry';
import { cShowDirective } from './directives/cShowRuntime'; // Import the new runtime directive
import { cModelDirective } from './directives/cModelRuntime'; // Import the new runtime directive

export interface App {
    use(plugin: Plugin, ...options: any[]): App;
    mount(rootContainer: HTMLElement | string): void;
    provide(key: string, value: any): App;
    directive(name: string, directive: Directive): App;
    setDelimiters(open: string, close: string): App;
    config: AppConfig;
}

export interface AppConfig {
    globalProperties: Record<string, any>;
    delimiters: [string, string];
    errorHandler?: (err: unknown, instance: any, info: string) => void;
}

export interface AppContext {
    config: AppConfig;
    provides: Record<string, any>;
}

export type Plugin = 
    | { install: (app: App, ...options: any[]) => any }
    | ((app: App, ...options: any[]) => any);

export function createApp(rootComponent: new () => Component): App {
        const context: AppContext = {
            config: reactive({
                globalProperties: reactive({}),
                delimiters: ['{{', '}}']
            }),
            provides: {}
        };

        const app: App = {
            config: context.config,

            use(plugin: Plugin, ...options: any[]) {
                if (typeof plugin === 'function') {
                    plugin(app, ...options);
                } else if (plugin && typeof plugin.install === 'function') {
                    plugin.install(app, ...options);
                }
                return app;
            },

            provide(key: string, value: any) {
                context.provides[key] = value;
                return app;
            },

            directive(name: string, directive: Directive) {
                registerDirective(name, directive);
                return app;
            },

            setDelimiters(open: string, close: string) {
                context.config.delimiters = [open, close];
                return app;
            },

            mount(rootContainer: HTMLElement | string) {
                const container = typeof rootContainer === 'string' 
                    ? document.querySelector(rootContainer) 
                    : rootContainer;
                
                if (!container) return;

                // Create the root Web Component via the custom elements registry.
                // Direct `new` on an HTMLElement subclass is illegal — the element
                // must be constructed through document.createElement() instead.
                const instance = document.createElement(getComponentTagName(rootComponent)) as any;

                // Register built-in runtime directives
                registerDirective('show', cShowDirective);
                registerDirective('model', cModelDirective);

                // Inject global provides into the root instance
                for (const key in context.provides) {
                    instance.provide(key, context.provides[key]);
                }

                // Initialize DevTools connection
                devtools.init();
                
                // Attach context for error handling
                (instance as any).appContext = context;

                // Mounting the element connects it to the DOM, which triggers
                // connectedCallback and the initial render into the shadow root.
                container.innerHTML = '';
                container.appendChild(instance);
            }
        };
        return app;
}