import { CompilerPlugin } from '../plugin';
import { Node, NodeTypes } from '../ast';

export const cOncePlugin: CompilerPlugin = {
    name: 'c-once',
    transformNode(node: Node) {
        if (node.type === NodeTypes.ELEMENT && node.props && 'c-once' in node.props) {
            // Remove the directive so it doesn't appear in the final HTML
            delete node.props['c-once'];
            
            // Recursively mark the entire branch as static
            markStatic(node);
        }
    }
};

function markStatic(node: Node) {
    node.isStatic = true;
    if (node.children) {
        node.children.forEach(child => markStatic(child));
    }
}