import { signal, Signal } from '../reactivity/signal';
import { inject } from '../runtime-core/apiInject';
import { App } from '../runtime-core/apiCreateApp';
import { Component } from '../runtime-core/Component';
import { createMatcher, RouteRecord, MatchResult } from './matcher';

export interface RouterOptions {
    routes: RouteRecord[];
}

export class Router {
    public currentRoute: Signal<MatchResult | null>;
    public routes: RouteRecord[];
    private matcher: (path: string) => MatchResult | null;

    constructor(options: RouterOptions) {
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

    push(path: string) {
        const match = this.matcher(path);
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', path);
        }
        this.currentRoute.value = match;
    }

    replace(path: string) {
        const match = this.matcher(path);
        if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', path);
        }
        this.currentRoute.value = match;
    }

    /**
     * Integration with app.use()
     */
    install(app: App) {
        app.provide('router', this);
    }
}

/**
 * Factory function to create a router instance.
 */
export function createRouter(options: RouterOptions): Router {
    return new Router(options);
}

export function useRouter(): Router {
    const router = inject<Router>('router');
    if (!router) {
        throw new Error('[Router] Router not found. Did you provide it in app.use()?');
    }
    return router;
}

export function useRoute() {
    return useRouter().currentRoute;
}