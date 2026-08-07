import { Signal } from '../reactivity/signal';
import { App } from '../runtime-core/apiCreateApp';
import { RouteRecord, MatchResult } from './matcher';
export interface RouterOptions {
    routes: RouteRecord[];
}
export declare class Router {
    currentRoute: Signal<MatchResult | null>;
    routes: RouteRecord[];
    private matcher;
    constructor(options: RouterOptions);
    push(path: string): void;
    replace(path: string): void;
    /**
     * Integration with app.use()
     */
    install(app: App): void;
}
/**
 * Factory function to create a router instance.
 */
export declare function createRouter(options: RouterOptions): Router;
export declare function useRouter(): Router;
export declare function useRoute(): Signal<MatchResult | null>;
//# sourceMappingURL=Router.d.ts.map