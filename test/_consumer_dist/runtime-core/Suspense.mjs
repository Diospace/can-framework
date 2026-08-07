// <Suspense>
//     <!-- Async Component -->
//     <AsyncWidget />
//     <!-- Fallback content -->
//     <div slot="fallback">
//         Loading widget...
//     </div>
// </Suspense>
import { Component } from "./Component.mjs";
import { signal } from "../reactivity/signal.mjs";
import { effect } from "../reactivity/effect.mjs";
import { provide } from "./apiInject.mjs";
export class Suspense extends Component {
    constructor() {
        super();
        this.pendingCount = signal(0, { internal: true });
        provide('SUSPENSE', {
            register: () => this.pendingCount.value++,
            resolve: () => this.pendingCount.value--
        });
    }
    render() {
        const container = document.createElement('div');
        const defaultSlot = document.createElement('div');
        const fallbackSlot = document.createElement('div');
        // Override appendChild to distribute nodes to slots based on 'slot' attribute.
        // This intercepts the compiler's attempts to append children to this component.
        const originalAppend = container.appendChild.bind(container);
        container.appendChild = (node) => {
            if (node instanceof Element && node.getAttribute('slot') === 'fallback') {
                return fallbackSlot.appendChild(node);
            }
            return defaultSlot.appendChild(node);
        };
        originalAppend(defaultSlot);
        originalAppend(fallbackSlot);
        this._scope.run(() => {
            effect(() => {
                if (this.pendingCount.value > 0) {
                    defaultSlot.style.display = 'none';
                    fallbackSlot.style.display = 'block';
                }
                else {
                    defaultSlot.style.display = 'block';
                    fallbackSlot.style.display = 'none';
                }
            });
        });
        return container;
    }
}
//# sourceMappingURL=Suspense.mjs.map