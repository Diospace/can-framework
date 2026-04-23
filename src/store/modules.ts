import { Signal, signal } from '../reactivity/signal';
import { Mutation } from './mutations';
import { Getter } from './getters';
import { Action } from './actions';
// import { Action , Action } from './Store';

/**
 * Options for defining a Store Module.
 * Similar to the main StoreOptions, but can be nested.
 */
export interface StoreModuleOptions<S extends object, M = any, A = any> {
    namespaced?: boolean; // Indicates if the module's state/mutations/actions are namespaced
    state: () => S;
    mutations?: { [K in keyof M]: Mutation<S, M[K]> };
    actions?: { [K in keyof A]: Action<S, A[K]> };
    getters?: Record<string, Getter<S>>;
    modules?: Record<string, StoreModuleOptions<any, any, any>>; // Nested modules
}

/**
 * Represents a compiled Store Module instance.
 */
export interface StoreModule<S extends object, M = any, A = any> {
    namespaced: boolean;
    state: Signal<S>;
    _mutations: Record<string, Mutation<S, any>>;
    _actions: Record<string, Action<S, any>>;
    _getters: Record<string, Getter<S>>;
    _children: Record<string, StoreModule<any, any, any>>;
}

export function createStoreModule<S extends object, M = any, A = any>(
    options: StoreModuleOptions<S, M, A>
): StoreModule<S, M, A> {
    return {
        namespaced: options.namespaced || false,
        state: signal(options.state(), { name: `Module State (${options.namespaced ? 'namespaced' : 'root'})`, internal: false }),
        _mutations: (options.mutations || {}) as Record<string, Mutation<S, any>>,
        _actions: (options.actions || {}) as Record<string, Action<S, any>>,
        _getters: (options.getters || {}) as Record<string, Getter<S>>,
        _children: {} // Children will be processed recursively by the main Store
    };
}