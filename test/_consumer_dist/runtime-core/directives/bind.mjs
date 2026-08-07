// import { cBind } from '../runtime-core/bind';
// import { signal } from '../reactivity/signal';
// const isActive = signal(true);
// const div = document.createElement('div');
// // Bind class
// cBind(div, 'class', () => ({ active: isActive.value, 'text-bold': true }));
// // Bind style
// cBind(div, 'style', { color: 'red', fontSize: '16px' });
// // Bind attribute
// cBind(div, 'id', 'my-element');
import { effect } from "../../reactivity/effect.mjs";
import { isSignal } from "../../reactivity/signal.mjs";
const camelizeRE = /-(\w)/g;
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};
export function cBind(el, name, value, modifiers = {}) {
    if (modifiers.camel)
        name = camelize(name);
    // 1. View -> State (Two-way binding)
    // If the bound value is a Signal, we can support two-way syncing
    // for user-interactable attributes.
    if (isSignal(value)) {
        const isCheckbox = el instanceof HTMLInputElement && el.type === 'checkbox';
        const isRadio = el instanceof HTMLInputElement && el.type === 'radio';
        // Determine the best event for the element type
        if (name === 'value' || (name === 'checked' && (isCheckbox || isRadio))) {
            const eventName = (el.tagName === 'SELECT' || isCheckbox || isRadio) ? 'change' : 'input';
            el.addEventListener(eventName, () => {
                if (name === 'value') {
                    value.value = el.value;
                }
                else if (name === 'checked') {
                    value.value = el.checked;
                }
            });
        }
        // 1.1 Support for Custom Elements (Web Components)
        // Convention: property "name" triggers "update:name" event
        if (el.tagName.includes('-')) {
            const customEventName = `update:${name}`;
            el.addEventListener(customEventName, (e) => {
                // Custom elements typically pass data in e.detail
                value.value = e.detail !== undefined ? e.detail : el[name];
            });
        }
    }
    // 2. State -> View (One-way / Interpolation syncing)
    effect(() => {
        const val = unwrap(value);
        if (name === 'class') {
            handleClass(el, val);
        }
        else if (name === 'style') {
            handleStyle(el, val);
        }
        else if (modifiers.prop) {
            el[name] = val;
        }
        else if (modifiers.attr) {
            handleAttribute(el, name, val);
        }
        else {
            // Default behavior: use property if it exists on the element, otherwise attribute
            if (name in el && !(el instanceof SVGElement)) {
                el[name] = val;
            }
            else {
                handleAttribute(el, name, val);
            }
        }
    });
}
function unwrap(val) {
    if (typeof val === 'function')
        return val();
    if (isSignal(val))
        return val.value;
    return val;
}
function handleClass(el, val) {
    const classes = [];
    if (Array.isArray(val)) {
        val.forEach(v => addClass(classes, v));
    }
    else {
        addClass(classes, val);
    }
    el.className = classes.join(' ');
}
function addClass(classes, val) {
    if (typeof val === 'string') {
        if (val)
            classes.push(val);
    }
    else if (typeof val === 'object' && val !== null) {
        Object.keys(val).forEach(key => {
            if (val[key])
                classes.push(key);
        });
    }
}
function handleStyle(el, val) {
    if (typeof val === 'string') {
        el.style.cssText = val;
    }
    else if (typeof val === 'object' && val !== null) {
        // Efficiently update individual properties
        const styleObj = el.style;
        for (const key in val) {
            styleObj[key] = val[key];
        }
        // Remove styles that are no longer in the object
        const valKeys = Object.keys(val);
        for (let i = el.style.length - 1; i >= 0; i--) {
            const name = el.style[i]; // This is kebab-case
            // Create a camelCase version for comparison
            const camelName = name.replace(/-(\w)/g, (_, c) => c.toUpperCase());
            if (!valKeys.includes(name) && !valKeys.includes(camelName)) {
                el.style.removeProperty(name);
            }
        }
    }
}
function handleAttribute(el, name, val) {
    if (val === null || val === undefined || val === false) {
        el.removeAttribute(name);
    }
    else {
        el.setAttribute(name, val === true ? '' : String(val));
    }
}
//# sourceMappingURL=bind.mjs.map