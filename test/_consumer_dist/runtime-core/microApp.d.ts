import { App } from './apiCreateApp';
export interface MicroAppOptions {
    name: string;
    rootComponent: any;
    mount: string | HTMLElement;
    sandbox?: boolean;
    scopeCSS?: boolean;
    props?: Record<string, any>;
}
export interface MicroAppInstance {
    app: App;
    unmount: () => void;
    bridge: EventBridge;
}
declare class EventBridge {
    private listeners;
    on(event: string, fn: Function): void;
    emit(event: string, payload?: any): void;
    off(event: string, fn: Function): void;
}
export declare function createMicroApp(options: MicroAppOptions): MicroAppInstance;
export {};
//# sourceMappingURL=microApp.d.ts.map