import { Component } from './Component';
import { warn } from '../shared/index';

export let currentInstance: any | null = null;

export function setCurrentInstance(instance: any | null) {
    currentInstance = instance;
}

// Define Symbols for lifecycle hooks to ensure unique property keys
export const BEFORE_MOUNT = Symbol('beforeMount');
export const MOUNTED = Symbol('mounted');
export const BEFORE_UPDATE = Symbol('beforeUpdate');
export const UPDATED = Symbol('updated');
export const BEFORE_UNMOUNT = Symbol('beforeUnmount');
export const UNMOUNTED = Symbol('unmounted');
export const ERROR_CAPTURED = Symbol('errorCaptured');

// Export an enum-like object for convenience and type safety when referencing hooks
export const LifecycleHooks = {
    BEFORE_MOUNT,
    MOUNTED,
    BEFORE_UPDATE,
    UPDATED,
    BEFORE_UNMOUNT,
    UNMOUNTED,
    ERROR_CAPTURED,
} as const;

export function injectHook(type: symbol, hook: Function, target: Component | null = currentInstance) {
    if (target) {
        // @ts-ignore
        const hooks = target[type] || (target[type] = []);
        hooks.push(hook);
    } else {
        warn(`Lifecycle hook "${String(type.description)}" called without active instance.`);
    }
}

export const onBeforeMount = (hook: Function) => injectHook(LifecycleHooks.BEFORE_MOUNT, hook);
export const onMounted = (hook: Function) => injectHook(LifecycleHooks.MOUNTED, hook);
export const onBeforeUpdate = (hook: Function) => injectHook(LifecycleHooks.BEFORE_UPDATE, hook);
export const onUpdated = (hook: Function) => injectHook(LifecycleHooks.UPDATED, hook);
export const onBeforeUnmount = (hook: Function) => injectHook(LifecycleHooks.BEFORE_UNMOUNT, hook);
export const onUnmounted = (hook: Function) => injectHook(LifecycleHooks.UNMOUNTED, hook);
export const onErrorCaptured = (hook: Function) => injectHook(LifecycleHooks.ERROR_CAPTURED, hook);