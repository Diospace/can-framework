import { computed } from '../reactivity/computed';

/**
 * useMemo hook: Returns a memoized (computed) reactive value.
 * Automatically tracks dependencies used inside the function.
 */
export function useMemo<T>(fn: () => T): any {
    return computed(fn);
}