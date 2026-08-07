import { effect } from "../../reactivity/index.mjs";
import { isRef, unref } from "../../reactivity/ref.mjs";
/**
 * Functional wrapper for the compiler-generated code.
 */
export function cModel(el, getter, setter, modifiers) {
    const binding = { value: { get value() { return getter(); }, set value(v) { setter(v); }, __c_isRef: true }, modifiers, instance: null };
    cModelDirective.mounted(el, binding);
}
/**
 * Runtime logic for c-model.
 * Note: In your codegen, you call 'cModel()'. This Directive object
 * is the implementation used by the runtime renderer.
 */
export const cModelDirective = {
    mounted(el, binding) {
        const input = el;
        const isCustomElement = el.tagName.includes('-');
        const modifiers = binding.modifiers || {};
        let eventName;
        if (isCustomElement) {
            // Support for Custom Components/Elements convention
            eventName = 'update:value';
        }
        else {
            const type = input.type;
            const tagName = input.tagName;
            // Use 'change' for lazy modifier or specific input types
            eventName = (modifiers.lazy || type === 'checkbox' || type === 'radio' || tagName === 'SELECT')
                ? 'change'
                : 'input';
        }
        // 1. View -> State (Event Listener)
        el.addEventListener(eventName, (e) => {
            if (isRef(binding.value)) {
                let newValue;
                if (isCustomElement) {
                    newValue = e.detail !== undefined ? e.detail : el.value;
                }
                else if (input.type === 'checkbox') {
                    newValue = input.checked;
                }
                else if (input.type === 'radio') {
                    if (!input.checked)
                        return;
                    newValue = input.value;
                }
                else {
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
            const type = input.type;
            if (type === 'checkbox') {
                input.checked = !!value;
            }
            else if (type === 'radio') {
                input.checked = input.value === String(value);
            }
            else {
                input.value = value == null ? '' : String(value);
            }
        });
    },
    updated(el, binding) {
        const input = el;
        const type = input.type;
        const value = unref(binding.value);
        if (type === 'checkbox') {
            input.checked = !!value;
        }
        else if (type === 'radio') {
            input.checked = input.value === String(value);
        }
        else {
            input.value = value == null ? '' : String(value);
        }
    }
};
//# sourceMappingURL=cModelRuntime.mjs.map