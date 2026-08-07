/**
 * createMatcher: Compiles route paths into Regular Expressions
 * to support dynamic parameters (e.g., /user/:id).
 */
export function createMatcher(routes = []) {
    const safeRoutes = routes || [];
    const compiledRoutes = safeRoutes.map(route => {
        const paramNames = [];
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
    return (path) => {
        const normalizedPath = path.split('?')[0].split('#')[0] || '/';
        for (const route of compiledRoutes) {
            const match = normalizedPath.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = decodeURIComponent(match[index + 1]);
                });
                return { component: route.component, params, path };
            }
        }
        return null;
    };
}
//# sourceMappingURL=matcher.mjs.map