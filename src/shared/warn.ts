declare const __DEV__: boolean;

/**
 * Prints a warning message to the console, typically only in development mode.
 * @param msg The warning message.
 * @param args Additional arguments to pass to console.warn.
 */
export function warn(msg: string, ...args: any[]) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn(`[Can Warn]: ${msg}`, ...args);
    }
}