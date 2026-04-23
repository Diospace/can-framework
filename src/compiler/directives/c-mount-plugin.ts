import { CompilerPlugin } from '../plugin';
import { Node, NodeTypes } from '../ast';

export const cMountPlugin: CompilerPlugin = {
    name: 'c-mount',
    transformNode(node: Node) {
        if (node.type !== NodeTypes.ELEMENT || !node.props) {
            return;
        }

        const mountHandler = node.props['c-mount'];
        if (mountHandler && typeof mountHandler === 'string') {
            // Transform c-mount="myMethod" into c-ref="(el) => this.myMethod(el)"
            node.props['c-ref'] = `(el) => this.${mountHandler}(el)`;
            delete node.props['c-mount'];
        }
    }
};