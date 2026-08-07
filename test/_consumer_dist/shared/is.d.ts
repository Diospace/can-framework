/**
 * Checks if a value is a non-null object.
 */
export declare const isObject: (val: unknown) => val is Record<any, any>;
/**
 * Checks if a value is a function.
 */
export declare const isFunction: (val: unknown) => val is Function;
/**
 * Checks if a value is a string.
 */
export declare const isString: (val: unknown) => val is string;
/**
 * Checks if a value is an array.
 */
export declare const isArray: (arg: any) => arg is any[];
/**
 * Returns true if the value has changed, handling NaN and other edge cases.
 */
export declare const hasChanged: (value: any, oldValue: any) => boolean;
//# sourceMappingURL=is.d.ts.map