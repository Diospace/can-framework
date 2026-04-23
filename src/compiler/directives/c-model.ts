import { CompilerPlugin } from '../plugin';

/**
 * c-model Directive Plugin
 * Handles two-way data binding for input elements.
 */
export const cModelPlugin: CompilerPlugin = {
    name: 'c-model',
    processDirective(key, value, { varName, isStatic, locals, processExpression }) {
        if (key.startsWith('c-model')) {
            // Parse modifiers (e.g., c-model.lazy -> ['lazy'])
            const parts = key.split('.');
            const modifiers = parts.slice(1);
            const modifierObj = `{ ${modifiers.map(m => `${m}: true`).join(', ')} }`;

            const processed = processExpression(value, locals);
            
            const statement = `cModel(${varName}, () => ${processed}, (val) => { ${processed} = val; }, ${modifierObj})`;
            
            if (isStatic) {
                let staticVal = processed;
                if (modifiers.includes('trim')) {
                    staticVal = `(typeof ${processed} === 'string' ? ${processed}.trim() : ${processed})`;
                }
                return `${varName}.value = ${staticVal};\n`;
            }
            return `${statement};\n`;
        }
        return null;
    }
};