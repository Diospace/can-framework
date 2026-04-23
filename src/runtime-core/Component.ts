import { LifecycleHooks, BEFORE_MOUNT, MOUNTED, BEFORE_UPDATE, UPDATED, BEFORE_UNMOUNT, UNMOUNTED, ERROR_CAPTURED, currentInstance, setCurrentInstance } from './apiLifecycle';
import { CanElement } from '../runtime-dom/customElement';
import { proxyRefs } from '../reactivity/ref';

//export class Component extends HTMLElement {
export class Component extends CanElement {
    // Storage for provided values
    private provides: Record<string, any> = {};
    template?: string;

    // Lifecycle storage
    [BEFORE_MOUNT]: Function[] = [];
    [MOUNTED]: Function[] = [];
    [BEFORE_UPDATE]: Function[] = [];
    [UPDATED]: Function[] = [];
    [BEFORE_UNMOUNT]: Function[] = [];
    [UNMOUNTED]: Function[] = [];
    [ERROR_CAPTURED]: Function[] = [];

    constructor() {
        super();
        return proxyRefs(this);
    }

    connectedCallback() {
        // Set the active instance for hooks and injection
        const prevInstance = setCurrentInstance(this);

        this._scope.run(() => {
            // 1. Run "Before Mount" hooks (using Symbol key)
            this[BEFORE_MOUNT].forEach(hook => hook());
            if ((this as any).onBeforeMount) (this as any).onBeforeMount();

            // 2. Delegate to CanElement to set up the reactive render effect.
            // This effect will call our overridden render() method.
            super.connectedCallback();

            // 3. Run "Mounted" hooks after the initial render batch is finished (using Symbol key)
            this._scope.run(() => {
                this[MOUNTED].forEach(hook => hook());
                if ((this as any).onMounted) (this as any).onMounted();
            });
        });

        setCurrentInstance(prevInstance);
    }

    disconnectedCallback() {
        // Run "Before Unmount" hooks (using Symbol key)
        this[BEFORE_UNMOUNT].forEach(hook => hook());
        if ((this as any).onBeforeUnmount) (this as any).onBeforeUnmount();

        // Run "Unmounted" hooks (using Symbol key)
        this[UNMOUNTED].forEach(hook => hook());
        if ((this as any).onUnmounted) (this as any).onUnmounted();
        
        super.disconnectedCallback();
    }

    render(): any {
        // This method is meant to be overridden by compiled components.
        // The base CanElement's _renderEffect will call this.
        return null;
    }

    // Dependency Injection: Provide a value to descendants
    provide(key: string, value: any) {
        this.provides[key] = value;
    }

    // Dependency Injection: Inject a value from an ancestor
    inject<T = any>(key: string, defaultValue?: T): T | undefined {
        // Start searching from the parent to allow shadowing (standard DI behavior)
        let el: HTMLElement | null = this.parentElement || ((this.getRootNode() as ShadowRoot).host as HTMLElement);
        
        // Walk up the DOM tree (including crossing Shadow DOM boundaries)
        while (el) {
            if (el instanceof Component && key in el.provides) {
                return el.provides[key];
            }
            el = el.parentElement || ((el.getRootNode() as ShadowRoot).host as HTMLElement);
        }
        return defaultValue;
    }
}

export function defineComponent(options: any) {
    return options;
}