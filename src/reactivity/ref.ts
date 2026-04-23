import { signal, isSignal, Signal } from './signal';
import { reactive, isReactive } from './reactive';
import { isObject } from '../shared/index';

export interface Ref<T> {
    value: T;
    __c_isRef: true;
}

export function ref<T>(value: T): Ref<T> {
    if (isRef<T>(value)) return value;
    
    const wrappedValue = isObject(value) ? reactive(value as object) : value;
    const s = signal(wrappedValue as T);
    
    Object.defineProperty(s, '__c_isRef', { value: true, enumerable: false });
    return s as unknown as Ref<T>;
}

export function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K
): Ref<T[K]> {
    const val = (object as any)[key];
    if (isRef(val)) return val as Ref<T[K]>;
    
    const r = {
        get value() {
            return (object as any)[key];
        },
        set value(newVal) {
            (object as any)[key] = newVal;
        }
    } as any;
    
    Object.defineProperty(r, '__c_isRef', { value: true, enumerable: false });
    return r;
}

export function toRefs<T extends object>(object: T): { [K in keyof T]: Ref<T[K]> } {
    const ret: any = Array.isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}

export function proxyRefs<T extends object>(objectWithRefs: T): any {
    return new Proxy(objectWithRefs, {
        get(target, key, receiver) {
            return unref(Reflect.get(target, key, receiver));
        },
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            if (isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            } else {
                return Reflect.set(target, key, value, receiver);
            }
        }
    });
}

export function isRef<T>(value: any): value is Ref<T> {
    return !!(value && value.__c_isRef === true);
}

export function unref<T>(ref: T | Ref<T>): T {
    return isRef(ref) ? ref.value : (ref as T);
}

export function shallowRef<T>(value: T): Ref<T> {
    const s = signal(value);
    Object.defineProperty(s, '__c_isRef', { value: true, enumerable: false });
    return s as unknown as Ref<T>;
}



