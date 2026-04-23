import { CompilerPlugin } from '../plugin';

/**
 * c-show Directive Plugin
 * Toggles the visibility of an element via the 'display' CSS property.
 */
export const cShowPlugin: CompilerPlugin = {
    name: 'c-show',
    processDirective(key, value, { varName, isStatic, locals, processExpression }) {
        if (key === 'c-show') {
            const processed = processExpression(value, locals);
            const statement = `${varName}.style.display = (${processed}) ? '' : 'none'`;

            if (isStatic) {
                return `${statement};\n`;
            }
            return `effect(() => { ${statement}; });\n`;
        }
        return null;
    }
};