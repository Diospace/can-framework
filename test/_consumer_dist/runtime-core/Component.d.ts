import { BEFORE_MOUNT, MOUNTED, BEFORE_UPDATE, UPDATED, BEFORE_UNMOUNT, UNMOUNTED, ERROR_CAPTURED } from './apiLifecycle';
import { CanElement } from '../runtime-dom/customElement';
export declare class Component extends CanElement {
    private provides;
    template?: string;
    [BEFORE_MOUNT]: Function[];
    [MOUNTED]: Function[];
    [BEFORE_UPDATE]: Function[];
    [UPDATED]: Function[];
    [BEFORE_UNMOUNT]: Function[];
    [UNMOUNTED]: Function[];
    [ERROR_CAPTURED]: Function[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): any;
    provide(key: string, value: any): void;
    inject<T = any>(key: string, defaultValue?: T): T | undefined;
}
export declare function defineComponent(options: any): any;
//# sourceMappingURL=Component.d.ts.map