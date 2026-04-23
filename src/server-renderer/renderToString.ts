import { Component } from '../runtime-core/Component';
import { watch } from '../reactivity/index';
import { Store } from '../store/Store'; 
import { currentInstance, setCurrentInstance } from '../runtime-core/apiLifecycle';
import * as polyfills from './polyfill';

/**
 * Renders a component class to an HTML string for Node.js environments.
 */
export async function renderToString(
    ComponentClass: new () => Component,
    props: any = {},
    store?: Store<any>
): Promise<string> {
    // Safety check for Node environment
    if (typeof HTMLElement === 'undefined') {
        polyfills.HTMLElement();
        polyfills.fetch();
    }

    // 1. Instantiate the component
    const instance = new ComponentClass();
    
    // 2. Setup initial reactive props
    if (props && (instance as any).props) {
        Object.assign((instance as any).props, props);
    }

    // 2.5. Provide store if available
    if (store) {
        const prevInstance = currentInstance;
        setCurrentInstance(instance);
        instance.provide('store', store);
        setCurrentInstance(prevInstance);
    }

    // 3. Trigger Mount Lifecycle
    if (instance.connectedCallback) {
        instance.connectedCallback();
    }

    // 4. Handle Async Content (Suspense Integration)
    const suspense = (instance as any).pendingCount;
    if (suspense && typeof suspense.value === 'number') {
        await new Promise<void>((resolve) => {
            const unwatch: any = watch(() => suspense.value, (count) => {
                if (count === 0) {
                    if (typeof unwatch === 'function') {
                        unwatch();
                    }
                    resolve();
                }
            }, { immediate: true });
        });
    }

    // 5. Extract HTML
    const html = instance.shadowRoot ? instance.shadowRoot.innerHTML : instance.innerHTML;

    // 6. Cleanup
    if (instance.disconnectedCallback) {
        instance.disconnectedCallback();
    }

    return html;
}