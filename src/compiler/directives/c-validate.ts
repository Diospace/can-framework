import { CompilerPlugin } from '../plugin';

/**
 * c-validate Directive Plugin
 * Syntax: c-validate="{ value: model, required: true, min: 5 }"
 */
export const cValidatePlugin: CompilerPlugin = {
    name: 'c-validate',
    processDirective(key, value, { varName, locals, processExpression }) {
        if (key === 'c-validate') {
            // Process the expression to handle 'this.' prefixes and signal unwrapping
            const processed = processExpression(value, locals);
            
            // Generates: cValidate(el, () => ({ value: this.model, required: true }))
            return `cValidate(${varName}, () => ${processed});\n`;
        }
        return null;
    }
};