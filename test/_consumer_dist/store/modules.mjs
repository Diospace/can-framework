import { signal } from "../reactivity/signal.mjs";
export function createStoreModule(options) {
    return {
        namespaced: options.namespaced || false,
        state: signal(options.state(), { name: `Module State (${options.namespaced ? 'namespaced' : 'root'})`, internal: false }),
        _mutations: (options.mutations || {}),
        _actions: (options.actions || {}),
        _getters: (options.getters || {}),
        _children: {} // Children will be processed recursively by the main Store
    };
}
//# sourceMappingURL=modules.mjs.map