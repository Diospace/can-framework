import { signal, Signal } from '../reactivity/signal';
import { computed } from '../reactivity/computed';
import { devtools, DevToolsEvents } from '../devtools/index';
import { inject } from '../runtime-core/apiInject';
import { App } from '../runtime-core/apiCreateApp';
import { warn } from '../shared/index'; // Import warn utility
import { Mutation } from './mutations';
import { Action } from './actions';
import { Getter } from './getters';

export interface StoreOptions<S, M = any, A = any> {
    state: () => S;
    mutations?: { [K in keyof M]: Mutation<S, M[K]> };
    actions?: { [K in keyof A]: Action<S, A[K]> };
    getters?: Record<string, Getter<S>>;
}

export class Store<S extends object, M = any, A = any> {
    public state: Signal<S>;
    public getters: Record<string, any> = {};
    private _mutations: Record<string, Mutation<S, any>>;
    private _actions: Record<string, Action<S, any>>; // Use generic A for actions
    private _subscribers: ((mutation: { type: string, payload: any }, state: S) => void)[] = [];

    constructor(options: StoreOptions<S, M, A>) {
        // Hydrate state from window if available (SSR support)
        const initialState = (typeof window !== 'undefined' && (window as any).__INITIAL_STATE__)
            ? (window as any).__INITIAL_STATE__
            : options.state();

        this.state = signal(initialState, { name: 'Store State', internal: false }); // Register with devtools, set internal to false if you want to see it
        this._mutations = (options.mutations || {}) as Record<string, Mutation<S, any>>;
        this._actions = (options.actions || {}) as Record<string, Action<S, any>>;

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
     * Commit a mutation to change state synchronously.
     */
    commit = <K extends keyof M>(type: K, payload?: M[K]) => {
        const mutation = this._mutations[type as string];
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
        
        mutation(this.state.value, payload as any);

        // Notify subscribers
        this._subscribers.forEach(sub => sub({ type: type as string, payload }, this.state.value));

        // Trigger reactivity for deep mutations
        this.state.value = this.state.value;
    }

    /**
     * Dispatch an action (can be asynchronous).
     */
    dispatch = <K extends keyof A>(type: K, payload?: A[K]) => {
        const action = this._actions[type as string];
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
        
        return action({ state: this.state.value, commit: this.commit as any }, payload);
    }

    /**
     * Subscribe to mutations. Useful for plugins (e.g., persistence).
     * Returns an unsubscribe function.
     */
    onMutation(fn: (mutation: { type: string, payload: any }, state: S) => void) {
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
    install(app: App) {
        app.provide('store', this);
    }
}

export function createStore<S extends object, M = any, A = any>(options: StoreOptions<S, M, A>) {
    return new Store<S, M, A>(options);
}

export function useStore<S extends object = any>(): Store<S> {
    const store = inject<Store<S>>('store');
    if (!store) {
        throw new Error('[Store] Store not found. Did you forget to provide it via app.provide("store", store)?');
    }
    return store;
}