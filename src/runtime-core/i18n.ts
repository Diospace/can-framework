import { signal } from '../reactivity/signal';
import { App } from './apiCreateApp';

export interface I18nOptions {
    locale: string;
    messages: Record<string, Record<string, string>>;
}

let activeI18n: { locale: any, messages: any } | null = null;

export function createI18n(options: I18nOptions) {
    const locale = signal(options.locale);
    const messages = options.messages;

    const instance = { locale, messages };
    activeI18n = instance;

    const t = (key: string) => {
        const currentLocale = locale.value;
        return messages[currentLocale]?.[key] || key;
    };

    return {
        locale,
        t,
        install(app: App) {
            app.provide('i18n', { locale, t });
        }
    };
}

export function t(key: string): string {
    if (!activeI18n) return key;
    const currentLocale = activeI18n.locale.value;
    return activeI18n.messages[currentLocale]?.[key] || key;
}