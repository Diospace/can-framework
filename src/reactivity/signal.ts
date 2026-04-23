import { trackEffects, ReactiveEffect } from './effect';
import { hasChanged } from '../shared/index';
import { queueJob } from '../runtime-core/scheduler';
import { createDep, Dep } from './dep';
import { devtools, DevToolsEvents } from '../devtools/devtools';

export interface Signal<T> {
    value: T;
}

export interface SignalOptions {
    name?: string;
    internal?: boolean;
}

let uid = 0;

export function signal<T>(initialValue: T, options: SignalOptions = {}): Signal<T> {
    const dep = createDep();
    let _value = initialValue;
    const id = uid++;

    const s: Signal<T> = {
        get value() {
            trackEffects(dep);
            return _value;
        },
        set value(newValue) {
            if (hasChanged(newValue, _value)) {
                const oldValue = _value;
                _value = newValue;
                devtools.emit(DevToolsEvents.SIGNAL_UPDATE, { id, newValue, oldValue });
                trigger(dep);
            }
        }
    };

    devtools.emit(DevToolsEvents.SIGNAL_INIT, { 
        id, 
        signal: s, 
        name: options.name, 
        internal: options.internal 
    });
    return s;
}

export function trigger(dep: Dep) {
    const effects = [...dep];
    for (const effect of effects) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            queueJob(effect);
        }
    }
}

export function isSignal(val: any): val is Signal<any> {
    return val && typeof val === 'object' && 'value' in val;
}

/**
 * Creates a shallow reactive signal.
 * In this framework, signal() is already shallow by default (use ref() for deep reactivity).
 */
export function shallowSignal<T>(initialValue: T, options: SignalOptions = {}): Signal<T> {
    return signal(initialValue, options);
}