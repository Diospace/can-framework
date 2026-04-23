import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Component } from '../src/runtime-core/Component';
import { signal } from '../src/reactivity';
import { nextTick } from '../src/runtime-dom/nextTick';

class CounterComponent extends Component {
    count = signal(0);
    
    // Hooks for testing
    onMounted() {}
    onUnmounted() {}

    render() {
        const btn = document.createElement('button');
        btn.id = 'counter';
        btn.textContent = `Count: ${this.count.value}`;
        btn.onclick = () => this.count.value++;
        return btn;
    }
}

if (!customElements.get('counter-component')) {
    customElements.define('counter-component', CounterComponent);
}

describe('Component System', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should mount and trigger lifecycle hooks', async () => {
        const el = new CounterComponent();
        const mountSpy = vi.spyOn(el, 'onMounted');
        
        document.body.appendChild(el);
        
        // Wait for microtask (scheduler flush)
        await nextTick();

        expect(mountSpy).toHaveBeenCalled();
        expect(el.shadowRoot?.innerHTML).toContain('Count: 0');
    });

    it('should batch DOM updates via the central scheduler', async () => {
        const el = new CounterComponent();
        document.body.appendChild(el);
        await nextTick();

        el.count.value = 1;
        el.count.value = 2;
        el.count.value = 3;

        // DOM should still show 0 before tick
        expect(el.shadowRoot?.innerHTML).toContain('Count: 0');
        
        await nextTick();
        expect(el.shadowRoot?.innerHTML).toContain('Count: 3');
    });

    it('should stop reactivity on unmount', async () => {
        const el = new CounterComponent();
        document.body.appendChild(el);
        await nextTick();
        
        const scopeSpy = vi.spyOn(el['_scope'], 'stop');
        document.body.removeChild(el);
        expect(scopeSpy).toHaveBeenCalled();
    });
});