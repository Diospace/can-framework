import { CompilerPlugin } from '../plugin';

/**
 * Boilerplate for Custom User Directives
 */
export const customDirectivePlugin: CompilerPlugin = {
    name: 'custom-directive',
    processDirective(key, value, { varName, locals, processExpression }) {
        if (key.startsWith('v-custom')) {
            const processed = processExpression(value, locals);
            return `console.log('Custom directive triggered on', ${varName}, 'with value:', ${processed});\n`;
        }
        return null;
    }
};