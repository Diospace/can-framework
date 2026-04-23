import { Dep, createDep } from './dep';
import { queueJob } from '../runtime-core/scheduler';

export type ReactiveEffect<T = any> = {
    (): T;
    active: boolean;
    deps: Dep[];
    scheduler?: () => void;
};

export const targetMap = new WeakMap<object, Map<any, Dep>>();
let activeEffect: ReactiveEffect | undefined = undefined;
let activeEffectScope: EffectScope | undefined = undefined;

export class EffectScope {
    active = true;
    effects: ReactiveEffect[] = [];

    run<T>(fn: () => T): T | undefined {
        if (this.active) {
            const prev = activeEffectScope;
            try {
                activeEffectScope = this;
                return fn();
            } finally {
                activeEffectScope = prev;
            }
        }
    }

    stop() {
        if (this.active) {
            this.effects.forEach(e => {
                e.active = false;
                cleanupEffect(e);
            });
            this.active = false;
        }
    }
}

export function effect<T>(fn: () => T, options?: { scheduler?: () => void; lazy?: boolean }): ReactiveEffect<T> {
    const _effect = createReactiveEffect(fn);
    if (options?.scheduler) _effect.scheduler = options.scheduler;
    if (!options?.lazy) _effect();
    return _effect;
}

function createReactiveEffect<T>(fn: () => T): ReactiveEffect<T> {
    const effectFn = (() => {
        if (!effectFn.active) return fn();
        try {
            activeEffect = effectFn;
            cleanupEffect(effectFn);
            return fn();
        } finally {
            activeEffect = undefined;
        }
    }) as ReactiveEffect<T>;

    effectFn.active = true;
    effectFn.deps = [];

    if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(effectFn);
    }

    return effectFn;
}

function cleanupEffect(effect: ReactiveEffect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}

export function track(target: object, key: unknown) {
    if (!activeEffect) return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = createDep()));
    }
    trackEffects(dep);
}

export function trackEffects(dep: Dep) {
    if (activeEffect && !dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}

export function triggerEffects(dep: Dep) {
    const effects = [...dep];
    for (const effect of effects) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            queueJob(effect);
        }
    }
}

export function trigger(target: object, key: unknown) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    
    const dep = depsMap.get(key);
    if (dep) {
        triggerEffects(dep);
    }
}
