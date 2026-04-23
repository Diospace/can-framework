import { CompilerPlugin } from '../plugin';

/**
 * c-bind Directive Plugin
 * Handles dynamic attribute binding. Supports both c-bind:prop and :prop shorthand.
 */
export const cBindPlugin: CompilerPlugin = {
    name: 'c-bind',
    processDirective(key, value, { varName, isStatic, locals, processExpression }) {
        if (key.startsWith('c-bind:') || key.startsWith(':')) {
            const attr = key.includes(':') ? key.split(':')[1] : key;
            const processed = processExpression(value, locals);
            
            // Use the framework's internal cBind helper for runtime reactivity
            const statement = `cBind(${varName}, "${attr}", () => ${processed})`;
            
            if (isStatic) {
                return `${varName}.setAttribute("${attr}", ${processed});\n`;
            }
            return `${statement};\n`;
        }
        return null;
    }
};