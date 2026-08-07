// <!-- Prevents default form submission -->
// <form @submit.prevent="handleSubmit">...</form>
// <!-- Stops click propagation -->
// <button @click.stop="doSomething">Click me</button>
// <!-- Chain modifiers -->
// <a @click.stop.prevent="doSomething">Link</a>
//import { cOn } from './on'; // Self-reference for type check if needed, or just export
export function cOn(el, event, handler, modifiers) {
    const options = {};
    const mods = new Set(modifiers);
    // if (modifiers.includes('capture')) options.capture = true;
    // if (modifiers.includes('once')) options.once = true;
    // if (modifiers.includes('passive')) options.passive = true;
    // if (mods.has('capture')) options.capture = true;
    // if (mods.has('once')) options.once = true;
    // if (mods.has('passive')) options.passive = true;
    options.capture = mods.has('capture');
    options.once = mods.has('once');
    options.passive = mods.has('passive');
    const stop = mods.has('stop');
    const prevent = mods.has('prevent');
    const self = mods.has('self');
    const listener = (e) => {
        //   if (modifiers.includes('stop')) e.stopPropagation();
        // if (modifiers.includes('prevent')) e.preventDefault();
        // if (modifiers.includes('self') && e.target !== el) return;
        if (stop)
            e.stopPropagation();
        if (prevent)
            e.preventDefault();
        if (self && e.target !== el)
            return;
        handler(e);
    };
    el.addEventListener(event, listener, options);
}
//# sourceMappingURL=on.mjs.map