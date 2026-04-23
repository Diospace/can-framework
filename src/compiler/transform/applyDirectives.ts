import { Node, NodeTypes } from '../ast';

/**
 * Applies attribute-level transformations such as shorthand expansion,
 * class merging, and scoped style markers.
 */
export function applyDirectives(node: Node, scopeId?: string) {
  if (node.type !== NodeTypes.ELEMENT || !node.props) return;

  const props = node.props;

  // 1. Handle c-bind and : shorthand
  Object.keys(props).forEach(key => {
    if (key.startsWith(':')) {
      const attr: string = key.slice(1);
      props[`c-bind:${attr}`] = props[key];
      delete props[key];
    }
  });

  // 2. Merge static class into c-bind:class
  if (props['class'] && props['c-bind:class']) {
    const staticClass = props['class'];
    const dynamicKey = 'c-bind:class';
    const dynamicClass = props[dynamicKey];
    props[dynamicKey] = `['${staticClass}', ${dynamicClass}]`;
    delete props['class'];
  }

  // 3. Handle c-on and @ shorthand
  Object.keys(props).forEach(key => {
    if (key.startsWith('@')) {
      const event: string = key.slice(1);
      props[`on${event}`] = props[key];
      delete props[key];
    } else if (key.startsWith('c-on:')) {
      const prefixLen = 5;
      const event: string = key.slice(prefixLen);
      props[`on${event}`] = props[key];
      delete props[key];
    }
  });

  // 4. Handle Scoped Styles
  if (scopeId) {
    props[`data-v-${scopeId}`] = '';
  }

  // 5. Handle c-slot and # shorthand
  if (props['c-slot']) {
    node.slotName = props['c-slot'] as string;
    delete props['c-slot'];
  }
  Object.keys(props).forEach(key => {
    if (key.startsWith('#')) {
      node.slotName = key.slice(1);
      delete props[key];
    } else if (key.startsWith('c-slot:')) {
      node.slotName = key.slice(7);
      delete props[key];
    }
  });
}