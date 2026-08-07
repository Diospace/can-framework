import { Dep } from './dep';
export type ReactiveEffect<T = any> = {
    (): T;
    active: boolean;
    deps: Dep[];
    scheduler?: () => void;
};
export declare const targetMap: WeakMap<object, Map<any, Dep>>;
export declare class EffectScope {
    active: boolean;
    effects: ReactiveEffect[];
    run<T>(fn: () => T): T | undefined;
    stop(): void;
}
export declare function effect<T>(fn: () => T, options?: {
    scheduler?: () => void;
    lazy?: boolean;
}): ReactiveEffect<T>;
export declare function track(target: object, key: unknown): void;
export declare function trackEffects(dep: Dep): void;
export declare function triggerEffects(dep: Dep): void;
export declare function trigger(target: object, key: unknown): void;
//# sourceMappingURL=effect.d.ts.map