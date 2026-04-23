import { effect } from '../../reactivity/index';
import { isRef, unref } from '../../reactivity/ref';
import { Directive, DirectiveBinding } from './baseDirective';

/**
 * Functional wrapper for the compiler-generated code.
 */
export function cModel(el: HTMLElement, getter: () => any, setter: (val: any) => void, modifiers: any) {
    const binding: DirectiveBinding = { value: { get value() { return getter(); }, set value(v) { setter(v); }, __c_isRef: true }, modifiers, instance: null };
    cModelDirective.mounted!(el, binding);
}

/**
 * Runtime logic for c-model.
 * Note: In your codegen, you call 'cModel()'. This Directive object 
 * is the implementation used by the runtime renderer.
 */
export const cModelDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const isCustomElement = el.tagName.includes('-');
        const modifiers = binding.modifiers || {};

        let eventName: string;
        if (isCustomElement) {
            // Support for Custom Components/Elements convention
            eventName = 'update:value';
        } else {
            const type = (input as HTMLInputElement).type;
            const tagName = input.tagName;
            // Use 'change' for lazy modifier or specific input types
            eventName = (modifiers.lazy || type === 'checkbox' || type === 'radio' || tagName === 'SELECT') 
                ? 'change' 
                : 'input';
        }

        // 1. View -> State (Event Listener)
        el.addEventListener(eventName, (e: any) => {
            if (isRef(binding.value)) {
                let newValue: any;
                if (isCustomElement) {
                    newValue = e.detail !== undefined ? e.detail : (el as any).value;
                } else if ((input as HTMLInputElement).type === 'checkbox') {
                    newValue = (input as HTMLInputElement).checked;
                } else if ((input as HTMLInputElement).type === 'radio') {
                    if (!(input as HTMLInputElement).checked) return;
                    newValue = input.value;
                } else {
                    newValue = input.value;
                }

                if (modifiers.trim && typeof newValue === 'string') {
                    newValue = newValue.trim();
                }

                if (modifiers.number) {
                    const n = parseFloat(newValue);
                    newValue = isNaN(n) ? newValue : n;
                }

                binding.value.value = newValue;
            }
        });

        // 2. State -> View (Reactivity)
        effect(() => {
            const value = unref(binding.value);
            const type = (input as HTMLInputElement).type;
            
            if (type === 'checkbox') {
                (input as HTMLInputElement).checked = !!value;
            } else if (type === 'radio') {
                (input as HTMLInputElement).checked = input.value === String(value);
            } else {
                input.value = value == null ? '' : String(value);
            }
        });
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const type = (input as HTMLInputElement).type;
        const value = unref(binding.value);

        if (type === 'checkbox') {
            (input as HTMLInputElement).checked = !!value;
        } else if (type === 'radio') {
            (input as HTMLInputElement).checked = input.value === String(value);
        } else {
            input.value = value == null ? '' : String(value);
        }
    }
};
