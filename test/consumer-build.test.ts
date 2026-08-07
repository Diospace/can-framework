import { describe, it, expect } from 'vitest';

describe('consumer app built from fresh dist', () => {
    it('mounts the compiled app and renders component output', async () => {
        const appEl = document.createElement('div');
        appEl.id = 'app';
        document.body.appendChild(appEl);
        await import('../test/_consumer_dist/main.mjs');
        await new Promise(r => setTimeout(r, 50));

        const container = document.querySelector('#app');
        expect(container).toBeTruthy();

        let found = false;
        const walk = (node: ChildNode) => {
            for (const child of Array.from(node.childNodes)) {
                const el = child as HTMLElement;
                if (el.shadowRoot) {
                    if (el.shadowRoot.textContent?.includes('Welcome to Can Framework')) {
                        found = true;
                    }
                }
                if (child.childNodes.length) walk(child);
            }
        };
        walk(container!);

        expect(found).toBe(true);
    });
});