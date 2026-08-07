import { createDep } from "./dep.mjs";
export const targetMap = new WeakMap();
let activeEffect = undefined;
let activeEffectScope = undefined;
export class EffectScope {
    constructor() {
        this.active = true;
        this.effects = [];
    }
    run(fn) {
        if (this.active) {
            const prev = activeEffectScope;
            try {
                activeEffectScope = this;
                return fn();
            }
            finally {
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
export function effect(fn, options) {
    const _effect = createReactiveEffect(fn);
    if (options?.scheduler)
        _effect.scheduler = options.scheduler;
    if (!options?.lazy)
        _effect();
    return _effect;
}
function createReactiveEffect(fn) {
    const effectFn = (() => {
        if (!effectFn.active)
            return fn();
        try {
            activeEffect = effectFn;
            cleanupEffect(effectFn);
            return fn();
        }
        finally {
            activeEffect = undefined;
        }
    });
    effectFn.active = true;
    effectFn.deps = [];
    if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(effectFn);
    }
    return effectFn;
}
function cleanupEffect(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
export function track(target, key) {
    if (!activeEffect)
        return;
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
export function trackEffects(dep) {
    if (activeEffect && !dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}
export function triggerEffects(dep) {
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
export function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const dep = depsMap.get(key);
    if (dep) {
        triggerEffects(dep);
    }
}
//# sourceMappingURL=effect.mjs.map