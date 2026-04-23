import { currentInstance } from './apiLifecycle';
import { Component } from './Component';
import { warn } from '../shared/index';

export function provide(key: string, value: any) {
    if (currentInstance) {
        currentInstance.provide(key, value);
    } else {
        warn(`provide() can only be used synchronously inside setup or lifecycle hooks.`);
    }
}

export function inject<T = any>(key: string, defaultValue?: T): T | undefined {
    if (currentInstance) {
        // Use the instance's method which performs the hierarchical DOM walk
        const val = currentInstance.inject(key);
        if (val !== undefined) return val;
    } else {
        warn(`inject() can only be used synchronously inside setup or lifecycle hooks.`);
    }
    return (defaultValue !== undefined) ? defaultValue : undefined;
}

export function createContext<T>(key: string, defaultValue?: T) {
    return {
        provide(value: T) {
            provide(key, value);
        },
        use() {
            return inject<T>(key, defaultValue);
        }
    };
}