import { effect, trackEffects, ReactiveEffect } from './effect';
import { createDep } from './dep';
import { trigger } from './signal';

class ComputedRefImpl<T> {
    private _value!: T;
    private _dirty = true;
    public dep = createDep();
    public effect: ReactiveEffect;

    constructor(getter: () => T) {
        this.effect = effect(getter, {
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(this.dep);
                }
            }
        });
    }

    get value() {
        trackEffects(this.dep);
        if (this._dirty) {
            this._dirty = false;
            this._value = this.effect();
        }
        return this._value;
    }
}

export function computed<T>(getter: () => T) {
    return new ComputedRefImpl(getter);
}