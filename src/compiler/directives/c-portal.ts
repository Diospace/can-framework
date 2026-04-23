import { CompilerPlugin } from '../plugin';

/**
 * c-portal Directive Plugin
 * Moves an element to a target DOM node (e.g., c-portal="#modals")
 */
export const cPortalPlugin: CompilerPlugin = {
    name: 'c-portal',
    processDirective(key, value, { varName, locals, processExpression }) {
        if (key.startsWith('c-portal')) {
            // Parse transition name from modifiers (e.g., c-portal.fade -> 'fade')
            const parts = key.split('.');
            const transitionName = parts[1] || '';

            // Transform the selector expression
            const processed = processExpression(value, locals);
            
            // Generates: cPortal(el, () => this.target, 'transitionName');
            return `cPortal(${varName}, () => ${processed}, '${transitionName}');\n`;
        }
        return null;
    }
};