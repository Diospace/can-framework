import { signal, Signal } from '../reactivity/signal';

/**
 * useState hook: Returns a reactive value and a function to update it.
 * Maps to the internal signal primitive.
 */
export function useState<T>(initialValue: T): [Signal<T>, (newValue: T) => void] {
    const s = signal(initialValue);
    
    const setter = (newValue: T) => {
        s.value = newValue;
    };

    return [s, setter];
}