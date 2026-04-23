import { CompilerPlugin } from '../plugin';
import { Node, NodeTypes } from '../ast';

export const buttonClassPlugin: CompilerPlugin = {
    name: 'button-class',
    transformNode(node: Node) {
        if (node.type === NodeTypes.ELEMENT && node.tag === 'button') {
            node.props = node.props || {};
            const existingClass = node.props['class'];

            if (typeof existingClass === 'string') {
                // Append to existing class
                node.props['class'] = `${existingClass} btn`;
            } else {
                // Create class attribute if it doesn't exist
                node.props['class'] = 'btn';
            }
        }
    }
};
