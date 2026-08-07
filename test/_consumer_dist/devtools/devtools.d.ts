import { EventEmitter } from './emitter';
export declare const enum DevToolsEvents {
    COMPONENT_MOUNT = "component:mount",
    COMPONENT_UNMOUNT = "component:unmount",
    SIGNAL_INIT = "signal:init",
    SIGNAL_UPDATE = "signal:update",
    EFFECT_TRIGGER = "effect:trigger",
    STORE_MUTATION = "store:mutation",
    STORE_ACTION = "store:action"
}
declare class CanDevTools extends EventEmitter {
    enabled: boolean;
    private _maxHistorySize;
    private _history;
    private _signals;
    private _components;
    _initBuffer: any[];
    init(): void;
    emit(event: string, ...args: any[]): void;
    /**
     * Reverts the application state to a specific point in time.
     * @param step The index in the history array to jump to.
     */
    jumpTo(step: number): void;
    /**
     * Clears the recorded history of state changes.
     */
    clearHistory(): void;
    /**
     * Captures the current value of all registered signals in the application.
     */
    getSnapshot(): Record<number, any>;
    /**
     * Restores the application state from a previously captured snapshot.
     * @param snapshot An object mapping signal IDs to their intended values.
     */
    restoreSnapshot(snapshot: Record<number, any>): void;
    /**
     * Compares two snapshots and returns the differences.
     * @param oldSnap The base snapshot
     * @param newSnap The snapshot to compare against
     */
    diffSnapshots(oldSnap: Record<number, any>, newSnap: Record<number, any>): Record<number, {
        oldValue: any;
        newValue: any;
    }>;
}
export declare const devtools: CanDevTools;
export {};
//# sourceMappingURL=devtools.d.ts.map