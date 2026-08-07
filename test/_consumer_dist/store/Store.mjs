import { signal } from "../reactivity/signal.mjs";
import { computed } from "../reactivity/computed.mjs";
import { devtools, DevToolsEvents } from "../devtools/index.mjs";
import { inject } from "../runtime-core/apiInject.mjs";
import { warn } from "../shared/index.mjs"; // Import warn utility
export class Store {
    constructor(options) {
        this.getters = {};
        this._subscribers = [];
        /**
         * Commit a mutation to change state synchronously.
         */
        this.commit = (type, payload) => {
            const mutation = this._mutations[type];
            if (!mutation) {
                warn(`[Store] Unknown mutation type: ${String(type)}`);
                return;
            }
            if (devtools.enabled) {
                devtools.emit(DevToolsEvents.STORE_MUTATION, {
                    type,
                    payload,
                    state: JSON.parse(JSON.stringify(this.state.value)), // Snapshot
                    timestamp: Date.now()
                });
            }
            mutation(this.state.value, payload);
            // Notify subscribers
            this._subscribers.forEach(sub => sub({ type: type, payload }, this.state.value));
            // Trigger reactivity for deep mutations
            this.state.value = this.state.value;
        };
        /**
         * Dispatch an action (can be asynchronous).
         */
        this.dispatch = (type, payload) => {
            const action = this._actions[type];
            if (!action) {
                warn(`[Store] Unknown action type: ${String(type)}`);
                return;
            }
            if (devtools.enabled) {
                devtools.emit(DevToolsEvents.STORE_ACTION, {
                    type,
                    payload,
                    timestamp: Date.now()
                });
            }
            return action({ state: this.state.value, commit: this.commit }, payload);
        };
        // Hydrate state from window if available (SSR support)
        const initialState = (typeof window !== 'undefined' && window.__INITIAL_STATE__)
            ? window.__INITIAL_STATE__
            : options.state();
        this.state = signal(initialState, { name: 'Store State', internal: false }); // Register with devtools, set internal to false if you want to see it
        this._mutations = (options.mutations || {});
        this._actions = (options.actions || {});
        // Initialize Getters as computed signals
        if (options.getters) {
            for (const key in options.getters) {
                const getterFn = options.getters[key];
                // Create a computed signal that tracks the state
                const c = computed(() => getterFn(this.state.value));
                // Proxy the access so the user can use store.getters.key
                Object.defineProperty(this.getters, key, {
                    get: () => c.value,
                    enumerable: true
                });
            }
        }
    }
    /**
     * Subscribe to mutations. Useful for plugins (e.g., persistence).
     * Returns an unsubscribe function.
     */
    onMutation(fn) {
        this._subscribers.push(fn);
        return () => {
            const index = this._subscribers.indexOf(fn);
            if (index > -1) {
                this._subscribers.splice(index, 1);
            }
        };
    }
    /**
     * Integration with app.use()
     */
    install(app) {
        app.provide('store', this);
    }
}
export function createStore(options) {
    return new Store(options);
}
export function useStore() {
    const store = inject('store');
    if (!store) {
        throw new Error('[Store] Store not found. Did you forget to provide it via app.provide("store", store)?');
    }
    return store;
}
//# sourceMappingURL=Store.mjs.map