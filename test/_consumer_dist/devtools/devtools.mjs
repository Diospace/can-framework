import { EventEmitter } from "./emitter.mjs";
export var DevToolsEvents;
(function (DevToolsEvents) {
    DevToolsEvents["COMPONENT_MOUNT"] = "component:mount";
    DevToolsEvents["COMPONENT_UNMOUNT"] = "component:unmount";
    DevToolsEvents["SIGNAL_INIT"] = "signal:init";
    DevToolsEvents["SIGNAL_UPDATE"] = "signal:update";
    DevToolsEvents["EFFECT_TRIGGER"] = "effect:trigger";
    DevToolsEvents["STORE_MUTATION"] = "store:mutation";
    DevToolsEvents["STORE_ACTION"] = "store:action";
})(DevToolsEvents || (DevToolsEvents = {}));
class CanDevTools extends EventEmitter {
    constructor() {
        super(...arguments);
        this.enabled = false;
        this._maxHistorySize = 1000;
        this._history = [];
        this._signals = new Map();
        this._components = new Set();
        this._initBuffer = [];
    }
    init() {
        if (typeof window === 'undefined' || this.enabled)
            return;
        if (!this.enabled) {
            // Standard bridge for browser extensions
            window.__CAN_DEVTOOLS__ = this;
            this.enabled = true;
            // Internal listeners to support Time-Travel
            this.on(DevToolsEvents.SIGNAL_INIT, (data) => {
                if (data.internal)
                    return; // Filter out internal framework signals
                this._signals.set(data.id, data.signal);
                // Buffer initialization to prevent flooding postMessage
                this._initBuffer.push({ id: data.id, name: data.name });
                if (this._initBuffer.length > 50) {
                    this.emit('signal:batch-init', this._initBuffer);
                    this._initBuffer = [];
                }
            });
            this.on(DevToolsEvents.SIGNAL_UPDATE, (data) => {
                if (!this._signals.has(data.id))
                    return; // Only record history for tracked signals
                this._history.push(data);
                if (this._history.length > this._maxHistorySize) {
                    this._history.shift();
                }
            });
            this.on(DevToolsEvents.COMPONENT_MOUNT, (vm) => this._components.add(vm));
            this.on(DevToolsEvents.COMPONENT_UNMOUNT, (vm) => this._components.delete(vm));
            this.emit('init', 'Can Framework Connected');
        }
    }
    emit(event, ...args) {
        if (!this.enabled && event !== 'init')
            return;
        super.emit(event, ...args);
        // Broadcast for browser extensions via postMessage
        // Payloads may contain DOM nodes (e.g. a mounted component) which are not
        // structured-cloneable, so flatten them to a JSON-safe representation first.
        if (typeof window !== 'undefined') {
            let payload = args;
            try {
                payload = JSON.parse(JSON.stringify(args));
            }
            catch {
                payload = [];
            }
            window.postMessage({
                source: 'can-devtools-bridge',
                event,
                payload
            }, '*');
        }
    }
    /**
     * Reverts the application state to a specific point in time.
     * @param step The index in the history array to jump to.
     */
    jumpTo(step) {
        if (step < 0 || step >= this._history.length)
            return;
        // Pause recording to prevent the jump itself from being added to history
        const wasEnabled = this.enabled;
        this.enabled = false;
        try {
            const stateAtStep = new Map();
            // Determine the value of every signal at the requested step
            for (let i = 0; i <= step; i++) {
                const { id, newValue } = this._history[i];
                stateAtStep.set(id, newValue);
            }
            // Apply the captured values to the live signals
            stateAtStep.forEach((value, id) => {
                const s = this._signals.get(id);
                if (s)
                    s.value = value;
            });
        }
        finally {
            this.enabled = wasEnabled;
        }
    }
    /**
     * Clears the recorded history of state changes.
     */
    clearHistory() {
        this._history = [];
    }
    /**
     * Captures the current value of all registered signals in the application.
     */
    getSnapshot() {
        const snapshot = {};
        this._signals.forEach((s, id) => {
            snapshot[id] = s.value;
        });
        return snapshot;
    }
    /**
     * Restores the application state from a previously captured snapshot.
     * @param snapshot An object mapping signal IDs to their intended values.
     */
    restoreSnapshot(snapshot) {
        const wasEnabled = this.enabled;
        this.enabled = false; // Pause recording during restoration
        try {
            Object.entries(snapshot).forEach(([id, value]) => {
                const s = this._signals.get(Number(id));
                if (s)
                    s.value = value;
            });
            console.log('[DevTools] State restored from snapshot');
        }
        finally {
            this.enabled = wasEnabled;
        }
    }
    /**
     * Compares two snapshots and returns the differences.
     * @param oldSnap The base snapshot
     * @param newSnap The snapshot to compare against
     */
    diffSnapshots(oldSnap, newSnap) {
        const diff = {};
        const allIds = new Set([...Object.keys(oldSnap), ...Object.keys(newSnap)]);
        allIds.forEach(idStr => {
            const id = Number(idStr);
            const oldVal = oldSnap[id];
            const newVal = newSnap[id];
            if (oldVal !== newVal) {
                diff[id] = { oldValue: oldVal, newValue: newVal };
            }
        });
        return diff;
    }
}
export const devtools = new CanDevTools();
//# sourceMappingURL=devtools.mjs.map