/**
 * Checks if a value is a non-null object.
 */
export const isObject = (val: unknown): val is Record<any, any> => {
    return val !== null && typeof val === 'object';
};

/**
 * Checks if a value is a function.
 */
export const isFunction = (val: unknown): val is Function => typeof val === 'function';

/**
 * Checks if a value is a string.
 */
export const isString = (val: unknown): val is string => typeof val === 'string';

/**
 * Checks if a value is an array.
 */
export const isArray = Array.isArray;

/**
 * Returns true if the value has changed, handling NaN and other edge cases.
 */
export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue);