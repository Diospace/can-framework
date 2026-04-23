export enum NodeTypes {
  ROOT = 'Root',
  ELEMENT = 'Element',
  TEXT = 'Text',
  INTERPOLATION = 'Interpolation'
}

export interface Node {
  type: NodeTypes;
  tag?: string;
  props?: Record<string, string | boolean>;
  content?: string;
  children?: Node[];
  ifCondition?: string;
  forLoop?: { alias: string; source: string };
  elseNode?: Node;
  slotName?: string;
  isStatic?: boolean;
}

export function createRoot(children: Node[] = []): Node {
  return { type: NodeTypes.ROOT, children };
}

export function createElement(tag: string, props: Record<string, string | boolean> = {}, children: Node[] = []): Node {
  return { type: NodeTypes.ELEMENT, tag, props, children };
}

export function createText(content: string): Node {
  return { type: NodeTypes.TEXT, content };
}

export function createInterpolation(content: string): Node {
  return { type: NodeTypes.INTERPOLATION, content };
}