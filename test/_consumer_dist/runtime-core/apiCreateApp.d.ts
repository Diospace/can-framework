import { Component } from './Component';
import { Directive } from './directives/baseDirective';
export interface App {
    use(plugin: Plugin, ...options: any[]): App;
    mount(rootContainer: HTMLElement | string): void;
    provide(key: string, value: any): App;
    directive(name: string, directive: Directive): App;
    setDelimiters(open: string, close: string): App;
    config: AppConfig;
}
export interface AppConfig {
    globalProperties: Record<string, any>;
    delimiters: [string, string];
    errorHandler?: (err: unknown, instance: any, info: string) => void;
}
export interface AppContext {
    config: AppConfig;
    provides: Record<string, any>;
}
export type Plugin = {
    install: (app: App, ...options: any[]) => any;
} | ((app: App, ...options: any[]) => any);
export declare function createApp(rootComponent: new () => Component): App;
//# sourceMappingURL=apiCreateApp.d.ts.map