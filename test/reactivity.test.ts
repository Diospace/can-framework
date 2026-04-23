import { describe, it, expect, vi } from 'vitest';
import { signal, effect, computed, watch, ref, proxyRefs, EffectScope, reactive } from '../src/reactivity';
import { nextTick } from '../src/runtime-dom/nextTick';

describe('Reactivity System', () => {
    it('signals should be reactive', () => {
        const count = signal(0);
        let val;
        effect(() => { val = count.value; });
        expect(val).toBe(0);
        count.value++;
        expect(val).toBe(1);
    });

    it('computed should be lazy and cached', () => {
        const count = signal(1);
        const getter = vi.fn(() => count.value * 2);
        const double = computed(getter);

        expect(getter).not.toHaveBeenCalled();
        expect(double.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(1);
        
        // Cache check
        expect(double.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(1);

        count.value = 2;
        expect(double.value).toBe(4);
        expect(getter).toHaveBeenCalledTimes(2);
    });

    it('reactive objects should track deep changes', () => {
        const state = reactive({ user: { name: 'Alice' } });
        let name;
        effect(() => { name = state.user.name; });
        
        expect(name).toBe('Alice');
        state.user.name = 'Bob';
        expect(name).toBe('Bob');
    });

    it('EffectScope should batch cleanups', () => {
        const count = signal(0);
        const scope = new EffectScope();
        const spy = vi.fn();

        scope.run(() => {
            effect(() => {
                spy(count.value);
            });
        });

        expect(spy).toHaveBeenCalledWith(0);
        count.value = 1;
        expect(spy).toHaveBeenCalledWith(1);

        scope.stop();
        count.value = 2;
        expect(spy).toHaveBeenCalledTimes(2); // Should not have been called with value '2'
    });

    it('proxyRefs should unwrap .value', () => {
        const count = ref(0);
        const state = proxyRefs({ count });

        expect(state.count).toBe(0); // auto-unwrap
        state.count = 5;
        expect(count.value).toBe(5);
        
        const newCount = ref(10);
        state.count = newCount;
        expect(state.count).toBe(10);
    });
});