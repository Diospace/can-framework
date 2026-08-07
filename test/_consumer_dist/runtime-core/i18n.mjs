import { signal } from "../reactivity/signal.mjs";
let activeI18n = null;
export function createI18n(options) {
    const locale = signal(options.locale);
    const messages = options.messages;
    const instance = { locale, messages };
    activeI18n = instance;
    const t = (key) => {
        const currentLocale = locale.value;
        return messages[currentLocale]?.[key] || key;
    };
    return {
        locale,
        t,
        install(app) {
            app.provide('i18n', { locale, t });
        }
    };
}
export function t(key) {
    if (!activeI18n)
        return key;
    const currentLocale = activeI18n.locale.value;
    return activeI18n.messages[currentLocale]?.[key] || key;
}
//# sourceMappingURL=i18n.mjs.map