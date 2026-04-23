import { effect } from './effect';
import { traverse, isReactive } from './reactive';
import { isRef } from './ref';
import { queueJob, queuePostFlushJob } from '../runtime-core/scheduler';

export function watch<T>(
    source: any, 
    cb: (newVal: any, oldVal: any) => void, 
    options: { immediate?: boolean; deep?: boolean; flush?: 'pre' | 'post' } = {}
) {
    let getter: () => any;
    let forceDeep = false;

    if (isRef(source)) {
        getter = () => source.value;
    } else if (isReactive(source)) {
        getter = () => source;
        forceDeep = true;
    } else if (Array.isArray(source)) {
        getter = () => source.map(s => {
            if (isRef(s)) return s.value;
            if (isReactive(s)) return traverse(s);
            return s;
        });
    } else if (typeof source === 'function') {
        getter = source;
    } else {
        getter = () => {};
    }

    if (options.deep || forceDeep) {
        const baseGetter = getter;
        getter = () => traverse(baseGetter());
    }

    let oldValue: any;

    const job = () => {
        const newValue = runner();
        if (options.deep || forceDeep || newValue !== oldValue) {
            cb(newValue, oldValue);
            oldValue = newValue;
        }
    };

    const runner = effect(getter, {
        scheduler: () => {
            if (options.flush === 'post') {
                queuePostFlushJob(job);
            } else {
                queueJob(job);
            }
        }
    });

    if (options.immediate) {
        job();
    } else {
        oldValue = runner();
    }
}