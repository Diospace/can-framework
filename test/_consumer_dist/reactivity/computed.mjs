import { effect, trackEffects } from "./effect.mjs";
import { createDep } from "./dep.mjs";
import { trigger } from "./signal.mjs";
class ComputedRefImpl {
    constructor(getter) {
        this._dirty = true;
        this.dep = createDep();
        this.effect = effect(getter, {
            lazy: true,
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
export function computed(getter) {
    return new ComputedRefImpl(getter);
}
//# sourceMappingURL=computed.mjs.map