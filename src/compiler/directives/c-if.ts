import { CompilerPlugin } from '../plugin';

/**
 * c-if Directive Plugin
 * Handles conditional rendering of elements.
 */
export const cIfPlugin: CompilerPlugin = {
    name: 'c-if',
    transformNode(node) {
        if (node.props && node.props['c-if']) {
            node.ifCondition = node.props['c-if'] as string;
            delete node.props['c-if'];
        }
    }
};