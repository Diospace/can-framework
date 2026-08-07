export declare const enum ReactiveFlags {
    IS_REACTIVE = "__c_isReactive",
    IS_READONLY = "__c_isReadonly",
    IS_SHALLOW = "__c_isShallow",
    RAW = "__c_raw"
}
export declare function reactive<T extends object>(target: T): T;
export declare function shallowReactive<T extends object>(target: T): T;
export declare function readonly<T extends object>(target: T): T;
export declare function shallowReadonly<T extends object>(target: T): T;
export declare function isReactive(value: any): boolean;
export declare function isReadonly(value: any): boolean;
export declare function isShallow(value: any): boolean;
export declare function markRaw<T extends object>(value: T): T;
export declare function toRaw<T>(observed: T): T;
/**
 * Recursively traverses an object to trigger all its reactive properties.
 * Essential for deep watching.
 */
export declare function traverse(value: any, seen?: Set<any>): any;
//# sourceMappingURL=reactive.d.ts.map