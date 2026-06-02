/**
 * Represents a single route definition provided by the user.
 */
export interface RouteRecord {
    path: string;
    component: any;
    name?: string;
}

/**
 * The result of a successful match, including extracted parameters.
 */
export interface MatchResult {
    component: any;
    params: Record<string, string>;
    path: string;
}

/**
 * createMatcher: Compiles route paths into Regular Expressions 
 * to support dynamic parameters (e.g., /user/:id).
 */
export function createMatcher(routes: RouteRecord[] = []): (path: string) => MatchResult | null {
    const safeRoutes = routes || [];
    const compiledRoutes = safeRoutes.map(route => {
        const paramNames: string[] = [];
        
        // Transform /user/:id into a regex pattern and track param names
        const regexPath = (route.path || '/')
            .replace(/\//g, '\\/') // Escape slashes
            .replace(/:([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (_, name) => {
                paramNames.push(name);
                return '([^\\/]+)'; // Capture segment
            });

        return {
            ...route,
            regex: new RegExp(`^${regexPath}\\/?$`), // Handle optional trailing slash
            paramNames
        };
    });

    return (path: string): MatchResult | null => {
        const normalizedPath = path.split('?')[0].split('#')[0] || '/';
        for (const route of compiledRoutes) {
            const match = normalizedPath.match(route.regex);
            if (match) {
                const params: Record<string, string> = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = decodeURIComponent(match[index + 1]);
                });
                return { component: route.component, params, path };
            }
        }
        return null;
    };
}