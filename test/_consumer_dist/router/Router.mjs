import { signal } from "../reactivity/signal.mjs";
import { inject } from "../runtime-core/apiInject.mjs";
import { createMatcher } from "./matcher.mjs";
export class Router {
    constructor(options) {
        this.routes = options.routes;
        this.matcher = createMatcher(this.routes);
        const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        this.currentRoute = signal(this.matcher(initialPath));
        // Listen for browser Back/Forward buttons
        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', () => {
                this.currentRoute.value = this.matcher(window.location.pathname);
            });
        }
    }
    push(path) {
        const match = this.matcher(path);
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', path);
            // Some test environments (e.g. happy-dom) don't reflect pushState in
            // window.location. Sync it manually; in real browsers this is a no-op
            // because pushState already updated the pathname.
            if (window.location.pathname !== path) {
                window.location.pathname = path;
            }
        }
        this.currentRoute.value = match;
    }
    replace(path) {
        const match = this.matcher(path);
        if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', path);
            if (window.location.pathname !== path) {
                window.location.pathname = path;
            }
        }
        this.currentRoute.value = match;
    }
    /**
     * Integration with app.use()
     */
    install(app) {
        app.provide('router', this);
    }
}
/**
 * Factory function to create a router instance.
 */
export function createRouter(options) {
    return new Router(options);
}
export function useRouter() {
    const router = inject('router');
    if (!router) {
        throw new Error('[Router] Router not found. Did you provide it in app.use()?');
    }
    return router;
}
export function useRoute() {
    return useRouter().currentRoute;
}
//# sourceMappingURL=Router.mjs.map