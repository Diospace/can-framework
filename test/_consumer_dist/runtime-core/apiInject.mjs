import { currentInstance } from "./apiLifecycle.mjs";
import { warn } from "../shared/index.mjs";
export function provide(key, value) {
    if (currentInstance) {
        currentInstance.provide(key, value);
    }
    else {
        warn(`provide() can only be used synchronously inside setup or lifecycle hooks.`);
    }
}
export function inject(key, defaultValue) {
    if (currentInstance) {
        // Use the instance's method which performs the hierarchical DOM walk
        const val = currentInstance.inject(key);
        if (val !== undefined)
            return val;
    }
    else {
        warn(`inject() can only be used synchronously inside setup or lifecycle hooks.`);
    }
    return (defaultValue !== undefined) ? defaultValue : undefined;
}
export function createContext(key, defaultValue) {
    return {
        provide(value) {
            provide(key, value);
        },
        use() {
            return inject(key, defaultValue);
        }
    };
}
//# sourceMappingURL=apiInject.mjs.map