import { effect } from '../../reactivity/effect';

export function cIf(
    parent: HTMLElement,
    condition: any, // Signal
    render: () => HTMLElement,
    elseRender?: () => HTMLElement
) {
    // Create a comment anchor to mark the position in the DOM
    const anchor = document.createComment('c-if');
    parent.appendChild(anchor);

    let currentNode: HTMLElement | null = null;
    let activeBranch: boolean | null = null; // null = uninitialized

    effect(() => {
        const value = !!condition.value;

        // Optimization: Only update DOM if the branch actually changes
        if (value === activeBranch) return;

        // Teardown existing node
        if (currentNode) {
            currentNode.remove();
            currentNode = null;
        }

        // Render new node
        if (value) {
            currentNode = render();
            parent.insertBefore(currentNode, anchor);
        } else if (elseRender) {
            currentNode = elseRender();
            parent.insertBefore(currentNode, anchor);
        }

        activeBranch = value;
    });
}
