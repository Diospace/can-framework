import { reactive } from "../reactivity/index.mjs";
import { devtools } from "../devtools/index.mjs";
import { registerDirective } from "./directives/directiveRegistry.mjs";
import { cShowDirective } from "./directives/cShowRuntime.mjs"; // Import the new runtime directive
import { cModelDirective } from "./directives/cModelRuntime.mjs"; // Import the new runtime directive
export function createApp(rootComponent) {
    const context = {
        config: reactive({
            globalProperties: reactive({}),
            delimiters: ['{{', '}}']
        }),
        provides: {}
    };
    const app = {
        config: context.config,
        use(plugin, ...options) {
            if (typeof plugin === 'function') {
                plugin(app, ...options);
            }
            else if (plugin && typeof plugin.install === 'function') {
                plugin.install(app, ...options);
            }
            return app;
        },
        provide(key, value) {
            context.provides[key] = value;
            return app;
        },
        directive(name, directive) {
            registerDirective(name, directive);
            return app;
        },
        setDelimiters(open, close) {
            context.config.delimiters = [open, close];
            return app;
        },
        mount(rootContainer) {
            const container = typeof rootContainer === 'string'
                ? document.querySelector(rootContainer)
                : rootContainer;
            if (!container)
                return;
            // Instantiate the root Web Component
            const instance = new rootComponent();
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
            instance.appContext = context;
            container.innerHTML = '';
            container.appendChild(instance.render());
        }
    };
    return app;
}
//# sourceMappingURL=apiCreateApp.mjs.map