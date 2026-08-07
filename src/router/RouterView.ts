import { Component } from '../runtime-core/Component';
import { effect } from '../reactivity/effect';
import { useRouter } from './Router';
import { defineCustomElement, getComponentTagName } from '../runtime-dom/customElement';

export class RouterView extends HTMLElement {
    render() {
        const container = document.createElement('div');
        container.style.display = 'contents'; // Don't affect layout
        
        const router = useRouter();

        // Watch the current path signal
        effect(() => {
                const match = router.currentRoute.value;
                
                // Clear previous content
                container.innerHTML = '';

                if (match) {
                    const ComponentClass = match.component;
                    const instance = document.createElement(getComponentTagName(ComponentClass)) as any;
                    // Pass extracted URL params as props to the component
                    Object.assign((instance as any).props, match.params);
                    container.appendChild(instance);
                } else {
                    container.textContent = '404 - Not Found';
                }
            });

        return container;
    }
}

// Register the router-view using the framework's custom element utility
defineCustomElement('router-view', RouterView);