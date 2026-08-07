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
export declare function createMatcher(routes?: RouteRecord[]): (path: string) => MatchResult | null;
//# sourceMappingURL=matcher.d.ts.map