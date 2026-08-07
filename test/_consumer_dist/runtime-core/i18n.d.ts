import { App } from './apiCreateApp';
export interface I18nOptions {
    locale: string;
    messages: Record<string, Record<string, string>>;
}
export declare function createI18n(options: I18nOptions): {
    locale: import("..").Signal<string>;
    t: (key: string) => string;
    install(app: App): void;
};
export declare function t(key: string): string;
//# sourceMappingURL=i18n.d.ts.map