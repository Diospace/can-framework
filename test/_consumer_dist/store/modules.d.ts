import { Signal } from '../reactivity/signal';
import { Mutation } from './mutations';
import { Getter } from './getters';
import { Action } from './actions';
/**
 * Options for defining a Store Module.
 * Similar to the main StoreOptions, but can be nested.
 */
export interface StoreModuleOptions<S extends object, M = any, A = any> {
    namespaced?: boolean;
    state: () => S;
    mutations?: {
        [K in keyof M]: Mutation<S, M[K]>;
    };
    actions?: {
        [K in keyof A]: Action<S, A[K]>;
    };
    getters?: Record<string, Getter<S>>;
    modules?: Record<string, StoreModuleOptions<any, any, any>>;
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
export declare function createStoreModule<S extends object, M = any, A = any>(options: StoreModuleOptions<S, M, A>): StoreModule<S, M, A>;
//# sourceMappingURL=modules.d.ts.map