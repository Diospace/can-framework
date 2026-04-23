import { Parser } from 'htmlparser2';
import { createRoot, Node, NodeTypes } from './ast';

// HTML Void elements that cannot have children
const VOID_TAGS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

export function parseTemplate(html: string): Node {
    const root = createRoot();
    const stack: Node[] = [root];

    const parser = new Parser({
        onopentag(name, attribs) {
            const node: Node = {
                type: NodeTypes.ELEMENT,
                tag: name,
                props: attribs,
                children: []
            };
            
            const parent = stack[stack.length - 1];
            parent.children = parent.children || [];
            parent.children.push(node);

            // Only push to stack if it's not a void element
            if (!VOID_TAGS.has(name.toLowerCase())) {
                stack.push(node);
            }
        },
        ontext(text) {
            // Heuristic: Keep text if it has non-whitespace content, 
            // OR if it is whitespace but doesn't contain newlines (likely inline spacing)
            if (text.trim().length > 0 || (text.length > 0 && !text.includes('\n'))) {
                const parent = stack[stack.length - 1];
                parent.children = parent.children || [];
                parent.children.push({
                    type: NodeTypes.TEXT,
                    content: text
                });
            }
        },
        onclosetag(name) {
            if (VOID_TAGS.has(name.toLowerCase())) return;

            if (stack.length > 1) {
                if (stack[stack.length - 1].tag === name) {
                    stack.pop();
                } else {
                    // Handle mismatched tags or implicitly closed tags
                    let i = stack.length - 1;
                    while (i > 0 && stack[i].tag !== name) {
                        i--;
                    }
                    if (i > 0) {
                        // Found it. Pop everything down to it.
                        while (stack.length > i) {
                            stack.pop();
                        }
                    }
                }
            }
        }
    }, { 
        decodeEntities: true,
        recognizeSelfClosing: true,
        lowerCaseTags: false,
        lowerCaseAttributeNames: false
    });

    parser.write(html);
    parser.end();

    return root;
}