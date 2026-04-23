/**
 * COMPREHENSIVE LIST of JS Globals/Reserved words to ignore.
 * Moved outside the function to avoid re-allocation on every call.
 */
const BUILT_INS = new Set([
    'true', 'false', 'null', 'undefined', 'this', 'new', 'typeof', 'instanceof', 'await', 'yield',
    'JSON', 'Math', 'Date', 'Array', 'Object', 'Number', 'String', 'Boolean', 'RegExp', 
    'Map', 'Set', 'WeakMap', 'WeakSet', 'Promise', 'Proxy', 'Reflect', 'Symbol', 'Error',
    'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'decodeURI', 'decodeURIComponent', 
    'encodeURI', 'encodeURIComponent', 'eval', 'setTimeout', 'setInterval', 
    'clearTimeout', 'clearInterval', 'fetch', 'alert', 'confirm', 'prompt',
    'window', 'document', 'console', 'navigator', 'location', 'history', 'screen', 
    'localStorage', 'sessionStorage', 'globalThis', 'NaN', 'Infinity', 'props'
]);

export function processExpression(expr: string, locals: string[]): string {
    const localSet = new Set(locals);
    const strings: string[] = [];
    
    // 1. Extract strings to prevent processing identifiers inside quotes
    let processedExpr: string = expr.replace(/(["'])(?:\\.|[^\\])*?\1/g, (m: string) => {
        strings.push(m);
        return `__STR_${strings.length - 1}__`;
    });

    /**
     * 2. Identify and transform identifiers.
     * The regex captures an optional '@' prefix and the identifier itself.
     */
    processedExpr = processedExpr.replace(/(@?)\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, 
        (match: string, forceChar: string, name: string, offset: number, fullStr: string) => {
         
            // A. Handle strings and built-ins immediately
            if (name.startsWith('__STR_') || BUILT_INS.has(name)) return match;

            // B. Priority: Check if name exists in the locals stack (passed via c-for)
            // If it's a local variable, we return it as is (no "this." prefix).
            if (localSet.has(name)) return match;

            // C. Forced Transformation: If it starts with '@', it's explicitly a component prop/signal
            if (forceChar === '@') return `this.${name}`;

            // D. Context Checks: Determine if the identifier is a property or object key
            const prefix = fullStr.slice(0, offset).trim();
            const rest = fullStr.slice(offset + match.length).trim();

            // Skip if it's already a property (e.g., user.name) or an object key (e.g., { name: val })
            if (prefix.endsWith('.') || rest.startsWith(':')) return match;

            // E. Prefix with 'this.': The runtime proxy will handle signal unwrapping (.value)
            if (prefix.endsWith('this.')) return match;

            return `this.${name}`;
    });

    // 3. Re-insert original strings
    processedExpr = processedExpr.replace(/__STR_(\d+)__/g, (_, i) => strings[parseInt(i)]);
    
    return processedExpr;
}