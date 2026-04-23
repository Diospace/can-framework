import { track, trigger } from './effect';
import { isObject, hasChanged } from '../shared/index';

export const enum ReactiveFlags {
    IS_REACTIVE = '__c_isReactive',
    IS_READONLY = '__c_isReadonly',
    IS_SHALLOW = '__c_isShallow',
    RAW = '__c_raw'
}

const reactiveMap = new WeakMap<object, any>();
const shallowReactiveMap = new WeakMap<object, any>();
const readonlyMap = new WeakMap<object, any>();
const shallowReadonlyMap = new WeakMap<object, any>();

export function reactive<T extends object>(target: T): T {
    return createReactiveObject(target, false, reactiveMap, false);
}

export function shallowReactive<T extends object>(target: T): T {
    return createReactiveObject(target, false, shallowReactiveMap, true);
}

export function readonly<T extends object>(target: T): T {
    return createReactiveObject(target, true, readonlyMap, false);
}

export function shallowReadonly<T extends object>(target: T): T {
    return createReactiveObject(target, true, shallowReadonlyMap, true);
}

function createReactiveObject(
    target: object,
    isReadonly: boolean,
    proxyMap: WeakMap<object, any>,
    isShallow: boolean
) {
    if (!isObject(target)) return target;
    if (proxyMap.has(target)) return proxyMap.get(target);

    const proxy = new Proxy(target, {
        get(target, key, receiver) {
            if (key === ReactiveFlags.IS_REACTIVE) return !isReadonly;
            if (key === ReactiveFlags.IS_READONLY) return isReadonly;
            if (key === ReactiveFlags.IS_SHALLOW) return isShallow;
            if (key === ReactiveFlags.RAW) return target;

            const res = Reflect.get(target, key, receiver);
            
            if (!isReadonly) {
                track(target, key);
            }

            if (isShallow) {
                return res;
            }

            return isObject(res) ? (isReadonly ? readonly(res) : reactive(res)) : res;
        },
        set(target, key, value, receiver) {
            if (isReadonly) {
                console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
                return true;
            }
            const oldValue = (target as any)[key];
            const result = Reflect.set(target, key, value, receiver);
            if (hasChanged(value, oldValue)) {
                trigger(target, key);
            }
            return result;
        },
        deleteProperty(target, key) {
            if (isReadonly) {
                console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
                return true;
            }
            const hasKey = Object.prototype.hasOwnProperty.call(target, key);
            const result = Reflect.deleteProperty(target, key);
            if (result && hasKey) {
                trigger(target, key);
            }
            return result;
        }
    });

    proxyMap.set(target, proxy);
    return proxy;
}

export function isReactive(value: any): boolean {
    return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}

export function isReadonly(value: any): boolean {
    return !!(value && value[ReactiveFlags.IS_READONLY]);
}

export function isShallow(value: any): boolean {
    return !!(value && value[ReactiveFlags.IS_SHALLOW]);
}

export function markRaw<T extends object>(value: T): T {
    Object.defineProperty(value, ReactiveFlags.RAW, { value, enumerable: false });
    return value;
}

export function toRaw<T>(observed: T): T {
    const raw = observed && (observed as any)[ReactiveFlags.RAW];
    return raw ? toRaw(raw) : observed;
}

/**
 * Recursively traverses an object to trigger all its reactive properties.
 * Essential for deep watching.
 */
export function traverse(value: any, seen: Set<any> = new Set()) {
    if (!isObject(value) || seen.has(value)) {
        return value;
    }
    seen.add(value);

    if (value && value.__c_isRef) {
        traverse(value.value, seen);
    } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            traverse(value[i], seen);
        }
    } else {
        for (const key in value) {
            traverse(value[key], seen);
        }
    }
    return value;
}
