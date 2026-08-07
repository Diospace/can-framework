/**
 * Checks if a value is a non-null object.
 */
export const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
/**
 * Checks if a value is a function.
 */
export const isFunction = (val) => typeof val === 'function';
/**
 * Checks if a value is a string.
 */
export const isString = (val) => typeof val === 'string';
/**
 * Checks if a value is an array.
 */
export const isArray = Array.isArray;
/**
 * Returns true if the value has changed, handling NaN and other edge cases.
 */
export const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
//# sourceMappingURL=is.mjs.map