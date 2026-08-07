export interface Ref<T> {
    value: T;
    __c_isRef: true;
}
export declare function ref<T>(value: T): Ref<T>;
export declare function toRef<T extends object, K extends keyof T>(object: T, key: K): Ref<T[K]>;
export declare function toRefs<T extends object>(object: T): {
    [K in keyof T]: Ref<T[K]>;
};
export declare function proxyRefs<T extends object>(objectWithRefs: T): any;
export declare function isRef<T>(value: any): value is Ref<T>;
export declare function unref<T>(ref: T | Ref<T>): T;
export declare function shallowRef<T>(value: T): Ref<T>;
//# sourceMappingURL=ref.d.ts.map