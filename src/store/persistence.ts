import { Store } from './Store';

/**
 * A persistence plugin for the Can Store that syncs state with localStorage.
 * 
 * @param key - The localStorage key to use.
 * @param keys - Optional array of state keys to persist. If omitted, the whole state is saved.
 */
export function createPersistencePlugin(key: string = 'can-store-state', keys?: string[]) {
    return (store: Store<any>) => {
        // Ensure we are in a browser environment
        if (typeof window === 'undefined') return;

        // 1. Initial Hydration: Load existing data from localStorage
        const savedState = localStorage.getItem(key);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                // Directly update the reactive state signal. 
                // If specific keys were requested, merge them with the initial state.
                if (keys) {
                    store.state.value = { ...store.state.value, ...parsed };
                } else {
                    store.state.value = parsed;
                }
            } catch (e) {
                console.error('[Store Persistence] Failed to hydrate state:', e);
            }
        }

        // 2. Continuous Sync: Subscribe to all future mutations
        store.onMutation((mutation, state) => {
            let dataToSave = state;

            // If specific keys are provided, create a partial object to save
            if (keys) {
                dataToSave = {};
                keys.forEach(k => {
                    if (k in state) {
                        dataToSave[k] = state[k];
                    }
                });
            }

            localStorage.setItem(key, JSON.stringify(dataToSave));
        });
    };
}