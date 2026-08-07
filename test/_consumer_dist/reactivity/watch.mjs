import { effect } from "./effect.mjs";
import { traverse, isReactive } from "./reactive.mjs";
import { isRef } from "./ref.mjs";
import { queueJob, queuePostFlushJob } from "../runtime-core/scheduler.mjs";
export function watch(source, cb, options = {}) {
    let getter;
    let forceDeep = false;
    if (isRef(source)) {
        getter = () => source.value;
    }
    else if (isReactive(source)) {
        getter = () => source;
        forceDeep = true;
    }
    else if (Array.isArray(source)) {
        getter = () => source.map(s => {
            if (isRef(s))
                return s.value;
            if (isReactive(s))
                return traverse(s);
            return s;
        });
    }
    else if (typeof source === 'function') {
        getter = source;
    }
    else {
        getter = () => { };
    }
    if (options.deep || forceDeep) {
        const baseGetter = getter;
        getter = () => traverse(baseGetter());
    }
    let oldValue;
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
            }
            else {
                queueJob(job);
            }
        }
    });
    if (options.immediate) {
        job();
    }
    else {
        oldValue = runner();
    }
}
//# sourceMappingURL=watch.mjs.map