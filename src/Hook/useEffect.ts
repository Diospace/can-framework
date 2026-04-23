import { effect } from '../reactivity/effect';
import { onUnmounted } from '../runtime-core/apiLifecycle';

/**
 * useEffect hook: Runs a side effect and handles cleanup.
 * Automatically cleans up when the component instance is unmounted.
 */
export function useEffect(effectFn: () => void | (() => void)) {
    let cleanup: void | (() => void);

    const runner = effect(() => {
        // Run cleanup from previous execution if it exists
        if (cleanup) cleanup();
        cleanup = effectFn();
    });

    // Ensure the effect stops and the final cleanup runs on unmount
    onUnmounted(() => {
        runner.active = false;
        if (cleanup) cleanup();
    });
}