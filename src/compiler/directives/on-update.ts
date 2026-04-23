// src/compiler/on-update-plugin.ts
import { CompilerPlugin } from '../plugin';

export const onUpdatePlugin: CompilerPlugin = {
    name: 'on-update',
    processDirective(key, value, { varName, isStatic, locals, processExpression }) {
        if (key === 'c-update') {
            const processed = processExpression(value, locals);
            if (isStatic) {
                // If static, it runs once during creation
                return `${processed};\n`;
            } else {
                // If dynamic, it runs whenever dependencies change
                return `effect(() => { ${processed} });\n`;
            }
        }
        return null;
    }
};
