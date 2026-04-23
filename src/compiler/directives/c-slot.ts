import { CompilerPlugin } from '../plugin';
import { Node, NodeTypes } from '../ast';

/**
 * c-slot Directive Plugin
 * Handles named slot projection. Supports c-slot:name and #name shorthand.
 */
export const cSlotPlugin: CompilerPlugin = {
    name: 'c-slot',
    transformNode(node: Node) {
        if (node.type === NodeTypes.ELEMENT && node.props) {
            for (const key in node.props) {
                if (key.startsWith('c-slot:') || key.startsWith('#')) {
                    const slotName = key.includes(':') ? key.split(':')[1] : key.slice(1);
                    node.slotName = slotName;
                    // Map to the native 'slot' attribute for Shadow DOM projection
                    node.props['slot'] = slotName;
                    delete node.props[key];
                }
            }
        }
    }
};