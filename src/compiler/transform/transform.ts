import { Node, NodeTypes } from '../ast';
import { CompilerPlugin } from '../plugin';
import { transformElement } from './transformElement';

/**
 * Core transformation entry point. Traverses the AST and applies
 * both plugin-based and built-in transformations.
 */
export function transform(root: Node, scopeId?: string, plugins: CompilerPlugin[] = []) {
  function traverse(node: Node) {
    // 1. Run plugin transformNode methods
    for (const plugin of plugins) {
      if (plugin.transformNode) {
        plugin.transformNode(node);
      }
    }

    // 2. Apply built-in element transformations
    transformElement(node, scopeId);

    if (node.children) {
      // 4. Handle conditional chains (c-else, c-else-if)
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === NodeTypes.ELEMENT && child.props) {
          if (child.props['c-else'] !== undefined || child.props['c-else-if'] !== undefined) {
            let j = i - 1;
            while (j >= 0 && node.children[j].type !== NodeTypes.ELEMENT) {
              j--;
            }
            if (j >= 0) {
              const prev = node.children[j];
              if (prev.type === NodeTypes.ELEMENT && (prev.ifCondition || prev.elseNode)) {
                let chain: Node = prev;
                while (chain.elseNode) chain = chain.elseNode;
                chain.elseNode = child;

                if (child.props['c-else-if']) {
                  child.ifCondition = child.props['c-else-if'] as string;
                  delete child.props['c-else-if'];
                } else {
                  delete child.props['c-else'];
                }

                node.children.splice(i, 1);
                i--;
                traverse(child);
              }
            }
          }
        }
      }

      node.children.forEach(traverse);
    }
  }

  traverse(root);
}
