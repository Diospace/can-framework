import { effect } from '../../reactivity/effect';
import { Directive, DirectiveBinding } from './baseDirective';
import { unref } from '../../reactivity/ref';

/**
 * Runtime implementation of c-show.
 * Toggles the 'display' style property based on the truthiness of the value.
 */
export const cShowDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        effect(() => {
            const val = unref(binding.value);
            el.style.display = val ? '' : 'none';
        });
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        const val = unref(binding.value);
        el.style.display = val ? '' : 'none';
    }
};
