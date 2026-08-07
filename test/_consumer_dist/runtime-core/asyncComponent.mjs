import { Component } from "./Component.mjs";
import { signal } from "../reactivity/signal.mjs";
import { effect } from "../reactivity/effect.mjs";
import { inject } from "./apiInject.mjs";
export function defineAsyncComponent(loader) {
    return class AsyncWrapper extends Component {
        constructor() {
            super(...arguments);
            this.loadedComp = signal(null);
            this.error = signal(null);
        }
        onBeforeMount() {
            const suspense = inject('SUSPENSE', null);
            if (suspense) {
                suspense.register();
            } // on compile to .mjs suspense.register will not be know
            loader()
                .then(comp => {
                // Support both ES modules and CommonJS
                this.loadedComp.value = comp.default || comp;
            })
                .catch(err => {
                this.error.value = err;
            })
                .finally(() => {
                if (suspense) {
                    suspense.resolve();
                } // also when compile npm run compile to mjs suspense.resolve will not be know
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
                }
                else if (this.loadedComp.value) {
                    const Comp = this.loadedComp.value;
                    // Instantiate the loaded component class
                    const instance = new Comp();
                    if (this.props)
                        instance.props = this.props;
                    // Execute lifecycle and render
                    if (instance.onBeforeMount)
                        instance.onBeforeMount();
                    container.appendChild(instance);
                }
                else {
                    container.innerHTML = '<div>Loading...</div>';
                }
            });
            return container;
        }
    };
}
//# sourceMappingURL=asyncComponent.mjs.map