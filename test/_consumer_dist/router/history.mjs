export function createWebHistory() {
    return {
        push(path) {
            if (typeof window !== 'undefined')
                window.history.pushState({}, '', path);
        },
        replace(path) {
            if (typeof window !== 'undefined')
                window.history.replaceState({}, '', path);
        },
        listen(cb) {
            if (typeof window !== 'undefined')
                window.addEventListener('popstate', () => cb(window.location.pathname));
        },
        get location() {
            return typeof window !== 'undefined' ? window.location.pathname : '/';
        }
    };
}
//# sourceMappingURL=history.mjs.map