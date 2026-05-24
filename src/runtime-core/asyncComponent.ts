import { Component } from './Component';
import { signal } from '../reactivity/signal';
import { effect } from '../reactivity/effect';
import { inject } from './apiInject';
//import { Suspense } from './Suspense'; this will provide the register() and resolve()

interface SuspenseContext {
    register: () => void;
    resolve: () => void;
}



export function defineAsyncComponent(loader: () => Promise<any>): any {
    return class AsyncWrapper extends Component {
        public loadedComp = signal<any>(null);
        public error = signal<any>(null);

        onBeforeMount() {
            const suspense = inject('SUSPENSE', null) as SuspenseContext | null;
            if (suspense) { suspense.register(); } // on compile to .mjs suspense.register will not be know

            loader()
                .then(comp => {
                    // Support both ES modules and CommonJS
                    this.loadedComp.value = comp.default || comp;
                })
                .catch(err => {
                    this.error.value = err;
                })
                .finally(() => {
                    if (suspense) { suspense.resolve(); } // also when compile npm run compile to mjs suspense.resolve will not be know
                });
        }

        render() {
            const container = document.createElement('div');

            effect(() => {
                container.innerHTML = '';

                if (this.error.value) {
                    container.innerHTML = `
                        <div class="error_value">
                            <h3>Error Loading component</h3>
                           <p>Status: ${this.error.value}</p>   
                       </div>`;
                } else if (this.loadedComp.value) {
                    const Comp = this.loadedComp.value;
                    // Instantiate the loaded component class
                    const instance = new Comp();
                    if ((this as any).props) (instance as any).props = (this as any).props;
                    
                    // Execute lifecycle and render
                    if ((instance as any).onBeforeMount) (instance as any).onBeforeMount();
                    container.appendChild(instance);
                } else {
                    container.innerHTML = '<div>Loading...</div>';
                }
            });

            return container;
        }
    }
}