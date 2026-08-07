/**
 * An empty function that does nothing. Used as a default callback.
 */
export declare const NOOP: () => void;
/**
 * Merges properties from source objects into a target object.
 */
export declare const extend: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
export declare function escapeHtml(string: unknown): string;
//# sourceMappingURL=utils.d.ts.map