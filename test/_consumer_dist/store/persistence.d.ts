import { Store } from './Store';
/**
 * A persistence plugin for the Can Store that syncs state with localStorage.
 *
 * @param key - The localStorage key to use.
 * @param keys - Optional array of state keys to persist. If omitted, the whole state is saved.
 */
export declare function createPersistencePlugin(key?: string, keys?: string[]): (store: Store<any>) => void;
//# sourceMappingURL=persistence.d.ts.map