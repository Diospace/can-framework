import { useRouter } from './Router';
import { defineCustomElement } from '../runtime-dom/customElement';

export class RouterLink extends HTMLElement {
    static get observedAttributes() {
        return ['to'];
    }

    render() {
        // Use reactive props so render re-runs when 'to' changes
        const to = this.getAttribute('to') || '/';
        const router = useRouter();

        const a = document.createElement('a');
        a.setAttribute('href', to);
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            router.push(to);
        });

        const slot = document.createElement('slot');
        a.appendChild(slot);
        
        return a;
    }
}

// Register the router-link using the framework's custom element utility
defineCustomElement('router-link', RouterLink, { observedAttributes: RouterLink.observedAttributes });