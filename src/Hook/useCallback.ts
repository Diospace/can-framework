import { markRaw } from '../reactivity/reactive';

/**
 * useCallback hook: Returns the function itself marked as raw.
 * Prevents unnecessary reactivity overhead when passed as props.
 */
export function useCallback<T extends Function>(fn: T): T {
    return markRaw(fn);
}