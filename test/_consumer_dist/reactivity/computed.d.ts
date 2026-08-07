import { ReactiveEffect } from './effect';
declare class ComputedRefImpl<T> {
    private _value;
    private _dirty;
    dep: import("./dep").Dep;
    effect: ReactiveEffect;
    constructor(getter: () => T);
    get value(): T;
}
export declare function computed<T>(getter: () => T): ComputedRefImpl<T>;
export {};
//# sourceMappingURL=computed.d.ts.map