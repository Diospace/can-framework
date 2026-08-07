import { effect } from "../../reactivity/effect.mjs";
import { unref } from "../../reactivity/ref.mjs";
/**
 * Runtime implementation of c-show.
 * Toggles the 'display' style property based on the truthiness of the value.
 */
export const cShowDirective = {
    mounted(el, binding) {
        effect(() => {
            const val = unref(binding.value);
            el.style.display = val ? '' : 'none';
        });
    },
    updated(el, binding) {
        const val = unref(binding.value);
        el.style.display = val ? '' : 'none';
    }
};
//# sourceMappingURL=cShowRuntime.mjs.map