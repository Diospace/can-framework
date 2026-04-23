// <!-- Prevents default form submission -->
// <form @submit.prevent="handleSubmit">...</form>

// <!-- Stops click propagation -->
// <button @click.stop="doSomething">Click me</button>

// <!-- Chain modifiers -->
// <a @click.stop.prevent="doSomething">Link</a>

//import { cOn } from './on'; // Self-reference for type check if needed, or just export

export function cOn(el: HTMLElement, event: string, handler: EventListener, modifiers: string[]) {
    const options: AddEventListenerOptions = {};
    
    if (modifiers.includes('capture')) options.capture = true;
    if (modifiers.includes('once')) options.once = true;
    if (modifiers.includes('passive')) options.passive = true;

    const listener = (e: Event) => {
        if (modifiers.includes('stop')) e.stopPropagation();
        if (modifiers.includes('prevent')) e.preventDefault();
        if (modifiers.includes('self') && e.target !== el) return;
        
        handler(e);
    };

    el.addEventListener(event, listener, options);
}

