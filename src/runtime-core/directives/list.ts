import { effect } from '../../reactivity/effect';

export function cFor(
    parent: HTMLElement,
    signal: any,
    render: (item: any, index: number) => HTMLElement,
    keyFn: (item: any, index: number) => any = (item) => item
) {
    let oldNodes = new Map<any, HTMLElement>();
    
    // Create anchors to mark the list boundaries in the DOM
    const startAnchor = document.createComment('c-for-start');
    const endAnchor = document.createComment('c-for-end');
    parent.appendChild(startAnchor);
    parent.appendChild(endAnchor);

    effect(() => {
        const newItems = signal.value || [];
        const newNodes = new Map<any, HTMLElement>();
        
        // 1. Create or reuse nodes
        newItems.forEach((item: any, index: number) => {
            const key = keyFn(item, index);
            let node = oldNodes.get(key);
            
            if (!node) {
                // Create new node if it doesn't exist
                node = render(item, index);
            }
            newNodes.set(key, node);
        });

        // 2. Reorder DOM
        // We iterate through the new list and ensure the DOM matches the order
        let cursor: Node = startAnchor;
        newItems.forEach((item: any, index: number) => {
            const key = keyFn(item, index);
            const node = newNodes.get(key)!;
            
            // If the node is not immediately following the cursor, move it there
            if (cursor.nextSibling !== node) {
                parent.insertBefore(node, cursor.nextSibling);
            }
            cursor = node;
        });

        // 3. Remove old nodes that are no longer present
        oldNodes.forEach((node, key) => {
            if (!newNodes.has(key)) {
                node.remove();
            }
        });

        oldNodes = newNodes;
    });
}