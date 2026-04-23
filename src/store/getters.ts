/**
 * Getters derive state from the store and are typically cached/reactive.
 */
export type Getter<S, T = any> = (state: S) => T;