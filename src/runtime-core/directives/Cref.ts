export function cRef(el: HTMLElement, ref: any) {
    if (typeof ref === 'function') {
        ref(el);
    } else if (ref && typeof ref === 'object' && 'value' in ref) {
        ref.value = el;
    }
}