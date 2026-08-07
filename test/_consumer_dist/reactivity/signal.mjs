import { trackEffects } from "./effect.mjs";
import { hasChanged } from "../shared/index.mjs";
import { createDep } from "./dep.mjs";
import { devtools, DevToolsEvents } from "../devtools/devtools.mjs";
let uid = 0;
export function signal(initialValue, options = {}) {
    const dep = createDep();
    let _value = initialValue;
    const id = uid++;
    const s = {
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
export function trigger(dep) {
    const effects = [...dep];
    for (const effect of effects) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect();
        }
    }
}
export function isSignal(val) {
    return val && typeof val === 'object' && 'value' in val;
}
/**
 * Creates a shallow reactive signal.
 * In this framework, signal() is already shallow by default (use ref() for deep reactivity).
 */
export function shallowSignal(initialValue, options = {}) {
    return signal(initialValue, options);
}
//# sourceMappingURL=signal.mjs.map