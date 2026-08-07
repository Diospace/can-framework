import { Component } from './Component';
export declare let currentInstance: any | null;
export declare function setCurrentInstance(instance: any | null): void;
export declare const BEFORE_MOUNT: unique symbol;
export declare const MOUNTED: unique symbol;
export declare const BEFORE_UPDATE: unique symbol;
export declare const UPDATED: unique symbol;
export declare const BEFORE_UNMOUNT: unique symbol;
export declare const UNMOUNTED: unique symbol;
export declare const ERROR_CAPTURED: unique symbol;
export declare const LifecycleHooks: {
    readonly BEFORE_MOUNT: typeof BEFORE_MOUNT;
    readonly MOUNTED: typeof MOUNTED;
    readonly BEFORE_UPDATE: typeof BEFORE_UPDATE;
    readonly UPDATED: typeof UPDATED;
    readonly BEFORE_UNMOUNT: typeof BEFORE_UNMOUNT;
    readonly UNMOUNTED: typeof UNMOUNTED;
    readonly ERROR_CAPTURED: typeof ERROR_CAPTURED;
};
export declare function injectHook(type: symbol, hook: Function, target?: Component | null): void;
export declare const onBeforeMount: (hook: Function) => void;
export declare const onMounted: (hook: Function) => void;
export declare const onBeforeUpdate: (hook: Function) => void;
export declare const onUpdated: (hook: Function) => void;
export declare const onBeforeUnmount: (hook: Function) => void;
export declare const onUnmounted: (hook: Function) => void;
export declare const onErrorCaptured: (hook: Function) => void;
//# sourceMappingURL=apiLifecycle.d.ts.map