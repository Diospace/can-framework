import { Component } from './Component';
import { warn } from '../shared';

export function callWithErrorHandling(
    fn: Function,
    instance: Component | null,
    type: string,
    args?: any[]
) {
    let res;
    try {
        res = args ? fn(...args) : fn();
    } catch (err) {
        handleError(err, instance, type);
    }
    return res;
}

export function callWithAsyncErrorHandling(
    fn: Function | Function[],
    instance: Component | null,
    type: string,
    args?: any[]
) {
    if (typeof fn === 'function') {
        const res = callWithErrorHandling(fn, instance, type, args);
        if (res && res.catch && typeof res.catch === 'function') {
            res.catch((err: any) => {
                handleError(err, instance, type);
            });
        }
        return res;
    }
}

export function handleError(err: unknown, instance: Component | null, type: string) {
    // 1. Component-level error hooks (onErrorCaptured) - Error Boundaries
    let parent = instance;
    while (parent) {
        // Traverse up DOM and Shadow DOM
        parent = (parent.parentElement || ((parent.getRootNode() as ShadowRoot)?.host)) as Component;
        if (!parent || !(parent instanceof Component)) break;

        const errorCaptured = (parent as any).onErrorCaptured;
        if (errorCaptured) {
            try {
                // If hook returns false, stop propagation
                const capture = errorCaptured.call(parent, err, instance, type);
                if (capture === false) return;
            } catch (err2) {
                // If the error hook itself throws, report both
                handleError(err2, parent, 'errorCaptured hook');
            }
        }
    }

    // 2. Global Error Handler
    // Find root to get appContext
    let root = instance;
    while (root) {
        if ((root as any).appContext) break;
        root = (root.parentElement || ((root.getRootNode() as ShadowRoot)?.host)) as Component;
    }

    const appConfig = root && (root as any).appContext && (root as any).appContext.config;
    if (appConfig && appConfig.errorHandler) {
        try {
            callWithErrorHandling(appConfig.errorHandler, null, 'appErrorHandler', [err, instance, type]);
        } catch (err2) {
            warn('Error in app.config.errorHandler', err2);
        }
    } else {
        // 3. Default Console Error
        console.error(`[Can Error]: Unhandled error in ${type}`);
        console.error(err);
    }
}