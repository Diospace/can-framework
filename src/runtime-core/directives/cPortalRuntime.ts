import { onUnmounted } from '../apiLifecycle';
import { unref } from '../../reactivity/ref';
import { enter, leave } from '../animation';

/**
 * Runtime helper for c-portal.
 * Moves the element to the target and handles cleanup on unmount.
 */
export function cPortal(el: HTMLElement, targetGetter: () => any, transitionName?: string) {
    // Resolve the target (supports strings or raw elements)
    const target = unref(targetGetter());
    const mountTarget = (typeof target === 'string' ? document.querySelector(target) : target) || document.body;
    
    // Append the element to the portal target
    if (mountTarget) {
        mountTarget.appendChild(el);
        if (transitionName) {
            enter(el, transitionName);
        }
    }
    
    // Cleanup: Remove from portal target when the component scope is destroyed
    onUnmounted(async () => {
        if (transitionName) {
            await leave(el, transitionName);
        }
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
}