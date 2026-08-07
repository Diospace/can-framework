import { signal } from "./signal.mjs";
import { reactive } from "./reactive.mjs";
import { isObject } from "../shared/index.mjs";
export function ref(value) {
    if (isRef(value))
        return value;
    const wrappedValue = isObject(value) ? reactive(value) : value;
    const s = signal(wrappedValue);
    Object.defineProperty(s, '__c_isRef', { value: true, enumerable: false });
    return s;
}
export function toRef(object, key) {
    const val = object[key];
    if (isRef(val))
        return val;
    const r = {
        get value() {
            return object[key];
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
    Object.defineProperty(r, '__c_isRef', { value: true, enumerable: false });
    return r;
}
export function toRefs(object) {
    const ret = Array.isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key, receiver) {
            return unref(Reflect.get(target, key, receiver));
        },
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            if (isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
            else {
                return Reflect.set(target, key, value, receiver);
            }
        }
    });
}
export function isRef(value) {
    return !!(value && value.__c_isRef === true);
}
export function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
export function shallowRef(value) {
    const s = signal(value);
    Object.defineProperty(s, '__c_isRef', { value: true, enumerable: false });
    return s;
}
//# sourceMappingURL=ref.mjs.map