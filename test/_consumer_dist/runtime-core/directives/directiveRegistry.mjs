const globalDirectives = new Map();
export function registerDirective(name, directive) {
    globalDirectives.set(name, directive);
}
export function getDirective(name) {
    return globalDirectives.get(name);
}
//# sourceMappingURL=directiveRegistry.mjs.map