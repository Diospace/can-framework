import { Dep } from './dep';
export interface Signal<T> {
    value: T;
}
export interface SignalOptions {
    name?: string;
    internal?: boolean;
}
export declare function signal<T>(initialValue: T, options?: SignalOptions): Signal<T>;
export declare function trigger(dep: Dep): void;
export declare function isSignal(val: any): val is Signal<any>;
/**
 * Creates a shallow reactive signal.
 * In this framework, signal() is already shallow by default (use ref() for deep reactivity).
 */
export declare function shallowSignal<T>(initialValue: T, options?: SignalOptions): Signal<T>;
//# sourceMappingURL=signal.d.ts.map