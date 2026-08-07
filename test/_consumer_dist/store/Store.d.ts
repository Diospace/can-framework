import { Signal } from '../reactivity/signal';
import { App } from '../runtime-core/apiCreateApp';
import { Mutation } from './mutations';
import { Action } from './actions';
import { Getter } from './getters';
export interface StoreOptions<S, M = any, A = any> {
    state: () => S;
    mutations?: {
        [K in keyof M]: Mutation<S, M[K]>;
    };
    actions?: {
        [K in keyof A]: Action<S, A[K]>;
    };
    getters?: Record<string, Getter<S>>;
}
export declare class Store<S extends object, M = any, A = any> {
    state: Signal<S>;
    getters: Record<string, any>;
    private _mutations;
    private _actions;
    private _subscribers;
    constructor(options: StoreOptions<S, M, A>);
    /**
     * Commit a mutation to change state synchronously.
     */
    commit: <K extends keyof M>(type: K, payload?: M[K]) => void;
    /**
     * Dispatch an action (can be asynchronous).
     */
    dispatch: <K extends keyof A>(type: K, payload?: A[K]) => any;
    /**
     * Subscribe to mutations. Useful for plugins (e.g., persistence).
     * Returns an unsubscribe function.
     */
    onMutation(fn: (mutation: {
        type: string;
        payload: any;
    }, state: S) => void): () => void;
    /**
     * Integration with app.use()
     */
    install(app: App): void;
}
export declare function createStore<S extends object, M = any, A = any>(options: StoreOptions<S, M, A>): Store<S, M, A>;
export declare function useStore<S extends object = any>(): Store<S>;
//# sourceMappingURL=Store.d.ts.map