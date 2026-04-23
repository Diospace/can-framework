// <Suspense>
//     <!-- Async Component -->
//     <AsyncWidget />
    
//     <!-- Fallback content -->
//     <div slot="fallback">
//         Loading widget...
//     </div>
// </Suspense>




import { Component } from './Component';
import { signal } from '../reactivity/signal';
import { effect } from '../reactivity/effect';
import { provide } from './apiInject';

export class Suspense extends Component {
    pendingCount = signal(0, { internal: true });

    constructor() {
        super();
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
        
        container.appendChild = <T extends Node>(node: T): T => {
            if (node instanceof Element && node.getAttribute('slot') === 'fallback') {
                return fallbackSlot.appendChild(node) as unknown as T;
            }
            return defaultSlot.appendChild(node) as unknown as T;
        };

        originalAppend(defaultSlot);
        originalAppend(fallbackSlot);

        this._scope.run(() => {
            effect(() => {
                if (this.pendingCount.value > 0) {
                    defaultSlot.style.display = 'none';
                    fallbackSlot.style.display = 'block';
                } else {
                    defaultSlot.style.display = 'block';
                    fallbackSlot.style.display = 'none';
                }
            });
        });

        return container;
    }
}