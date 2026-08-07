var _a, _b, _c, _d, _e, _f, _g;
import { BEFORE_MOUNT, MOUNTED, BEFORE_UPDATE, UPDATED, BEFORE_UNMOUNT, UNMOUNTED, ERROR_CAPTURED, setCurrentInstance } from "./apiLifecycle.mjs";
import { CanElement } from "../runtime-dom/customElement.mjs";
import { proxyRefs } from "../reactivity/ref.mjs";
//export class Component extends HTMLElement {
export class Component extends CanElement {
    constructor() {
        super();
        // Storage for provided values
        this.provides = {};
        // Lifecycle storage
        this[_a] = [];
        this[_b] = [];
        this[_c] = [];
        this[_d] = [];
        this[_e] = [];
        this[_f] = [];
        this[_g] = [];
        return proxyRefs(this);
    }
    connectedCallback() {
        // Set the active instance for hooks and injection
        const prevInstance = setCurrentInstance(this);
        this._scope.run(() => {
            // 1. Run "Before Mount" hooks (using Symbol key)
            this[BEFORE_MOUNT].forEach(hook => hook());
            if (this.onBeforeMount)
                this.onBeforeMount();
            // 2. Delegate to CanElement to set up the reactive render effect.
            // This effect will call our overridden render() method.
            super.connectedCallback();
            // 3. Run "Mounted" hooks after the initial render batch is finished (using Symbol key)
            this._scope.run(() => {
                this[MOUNTED].forEach(hook => hook());
                if (this.onMounted)
                    this.onMounted();
            });
        });
        setCurrentInstance(prevInstance);
    }
    disconnectedCallback() {
        // Run "Before Unmount" hooks (using Symbol key)
        this[BEFORE_UNMOUNT].forEach(hook => hook());
        if (this.onBeforeUnmount)
            this.onBeforeUnmount();
        // Run "Unmounted" hooks (using Symbol key)
        this[UNMOUNTED].forEach(hook => hook());
        if (this.onUnmounted)
            this.onUnmounted();
        super.disconnectedCallback();
    }
    render() {
        // This method is meant to be overridden by compiled components.
        // The base CanElement's _renderEffect will call this.
        return null;
    }
    // Dependency Injection: Provide a value to descendants
    provide(key, value) {
        this.provides[key] = value;
    }
    // Dependency Injection: Inject a value from an ancestor
    inject(key, defaultValue) {
        // Start searching from the parent to allow shadowing (standard DI behavior)
        let el = this.parentElement || this.getRootNode().host;
        // Walk up the DOM tree (including crossing Shadow DOM boundaries)
        while (el) {
            if (el instanceof Component && key in el.provides) {
                return el.provides[key];
            }
            el = el.parentElement || el.getRootNode().host;
        }
        return defaultValue;
    }
}
_a = BEFORE_MOUNT, _b = MOUNTED, _c = BEFORE_UPDATE, _d = UPDATED, _e = BEFORE_UNMOUNT, _f = UNMOUNTED, _g = ERROR_CAPTURED;
export function defineComponent(options) {
    return options;
}
//# sourceMappingURL=Component.mjs.map