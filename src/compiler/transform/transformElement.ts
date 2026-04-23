import { Node, NodeTypes } from '../ast';
import { applyDirectives } from './applyDirectives';

/**
 * Handles element-level transformations including structural directive extraction.
 */
export function transformElement(node: Node, scopeId?: string) {
    if (node.type !== NodeTypes.ELEMENT || !node.props) return;

    // 1. Apply built-in attribute transformations (shorthands, classes, scoping)
    applyDirectives(node, scopeId);

    // 2. Extract structural directives from props into dedicated node properties
    const props = node.props;
    
    if (props['c-if']) {
        node.ifCondition = props['c-if'] as string;
        delete props['c-if'];
    }

    if (props['c-for']) {
        const loop: string = props['c-for'] as string;
        const [alias, source] = loop.split(' in ').map(s => s.trim());
        node.forLoop = { alias, source };
        delete props['c-for'];
    }
}