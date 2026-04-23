export interface RouterHistory {
    push(path: string): void;
    replace(path: string): void;
    listen(cb: (path: string) => void): void;
    readonly location: string;
}

export function createWebHistory(): RouterHistory {
    return {
        push(path: string) {
            if (typeof window !== 'undefined') window.history.pushState({}, '', path);
        },
        replace(path: string) {
            if (typeof window !== 'undefined') window.history.replaceState({}, '', path);
        },
        listen(cb: (path: string) => void) {
            if (typeof window !== 'undefined') window.addEventListener('popstate', () => cb(window.location.pathname));
        },
        get location() {
            return typeof window !== 'undefined' ? window.location.pathname : '/';
        }
    };
}