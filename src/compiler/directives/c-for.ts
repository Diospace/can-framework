import { CompilerPlugin } from '../plugin';

/**
 * c-for Directive Plugin
 * Handles list rendering by extracting alias and source.
 */
export const cForPlugin: CompilerPlugin = {
    name: 'c-for',
    transformNode(node) {
        if (node.props && node.props['c-for']) {
            const loop = node.props['c-for'] as string;
            const [alias, source] = loop.split(' in ').map(s => s.trim());
            node.forLoop = { alias, source };
            delete node.props['c-for'];
        }
    }
};