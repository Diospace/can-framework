import { EventEmitter } from './emitter';
import { Component } from '../runtime-core/Component';

export const enum DevToolsEvents {
    COMPONENT_MOUNT = 'component:mount',
    COMPONENT_UNMOUNT = 'component:unmount',
    SIGNAL_INIT = 'signal:init',
    SIGNAL_UPDATE = 'signal:update',
    EFFECT_TRIGGER = 'effect:trigger',
    STORE_MUTATION = 'store:mutation',
    STORE_ACTION = 'store:action'
}

class CanDevTools extends EventEmitter {
    public enabled = false;
    private _maxHistorySize = 1000;
    private _history: { id: number, newValue: any, oldValue: any }[] = [];
    private _signals = new Map<number, any>();
    private _components = new Set<Component>();
    
    init() {
        if (typeof window === 'undefined' || this.enabled) return;

        if (!this.enabled) {
            // Standard bridge for browser extensions
            (window as any).__CAN_DEVTOOLS__ = this;
            this.enabled = true;

            // Internal listeners to support Time-Travel
            this.on(DevToolsEvents.SIGNAL_INIT, (data: any) => {
                if (data.internal) return; // Filter out internal framework signals
                this._signals.set(data.id, data.signal);
            });
            this.on(DevToolsEvents.SIGNAL_UPDATE, (data: any) => {
                if (!this._signals.has(data.id)) return; // Only record history for tracked signals
                this._history.push(data);
                if (this._history.length > this._maxHistorySize) {
                    this._history.shift();
                }
            });

            this.on(DevToolsEvents.COMPONENT_MOUNT, (vm: Component) => this._components.add(vm));
            this.on(DevToolsEvents.COMPONENT_UNMOUNT, (vm: Component) => this._components.delete(vm));

            this.emit('init', 'Can Framework Connected');
        }
    }

    emit(event: string, ...args: any[]) {
        if (!this.enabled && event !== 'init') return;
        super.emit(event, ...args);
        
        // Broadcast for browser extensions via postMessage
        if (typeof window !== 'undefined') {
            window.postMessage({
                source: 'can-devtools-bridge',
                event,
                payload: args
            }, '*');
        }
    }

    /**
     * Reverts the application state to a specific point in time.
     * @param step The index in the history array to jump to.
     */
    public jumpTo(step: number) {
        if (step < 0 || step >= this._history.length) return;

        // Pause recording to prevent the jump itself from being added to history
        const wasEnabled = this.enabled;
        this.enabled = false;

        try {
            const stateAtStep = new Map<number, any>();
            // Determine the value of every signal at the requested step
            for (let i = 0; i <= step; i++) {
                const { id, newValue } = this._history[i];
                stateAtStep.set(id, newValue);
            }

            // Apply the captured values to the live signals
            stateAtStep.forEach((value, id) => {
                const s = this._signals.get(id);
                if (s) s.value = value;
            });
        } finally {
            this.enabled = wasEnabled;
        }
    }

    /**
     * Clears the recorded history of state changes.
     */
    public clearHistory() {
        this._history = [];
    }

    /**
     * Captures the current value of all registered signals in the application.
     */
    public getSnapshot() {
        const snapshot: Record<number, any> = {};
        this._signals.forEach((s, id) => {
            snapshot[id] = s.value;
        });
        return snapshot;
    }

    /**
     * Restores the application state from a previously captured snapshot.
     * @param snapshot An object mapping signal IDs to their intended values.
     */
    public restoreSnapshot(snapshot: Record<number, any>) {
        const wasEnabled = this.enabled;
        this.enabled = false; // Pause recording during restoration

        try {
            Object.entries(snapshot).forEach(([id, value]) => {
                const s = this._signals.get(Number(id));
                if (s) s.value = value;
            });
            console.log('[DevTools] State restored from snapshot');
        } finally {
            this.enabled = wasEnabled;
        }
    }

    /**
     * Compares two snapshots and returns the differences.
     * @param oldSnap The base snapshot
     * @param newSnap The snapshot to compare against
     */
    public diffSnapshots(oldSnap: Record<number, any>, newSnap: Record<number, any>) {
        const diff: Record<number, { oldValue: any, newValue: any }> = {};
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