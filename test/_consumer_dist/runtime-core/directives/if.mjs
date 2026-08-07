import { effect } from "../../reactivity/effect.mjs";
export function cIf(parent, condition, // Signal
render, elseRender) {
    // Create a comment anchor to mark the position in the DOM
    const anchor = document.createComment('c-if');
    parent.appendChild(anchor);
    let currentNode = null;
    let activeBranch = null; // null = uninitialized
    effect(() => {
        const value = !!condition.value;
        // Optimization: Only update DOM if the branch actually changes
        if (value === activeBranch)
            return;
        // Teardown existing node
        if (currentNode) {
            currentNode.remove();
            currentNode = null;
        }
        // Render new node
        if (value) {
            currentNode = render();
            parent.insertBefore(currentNode, anchor);
        }
        else if (elseRender) {
            currentNode = elseRender();
            parent.insertBefore(currentNode, anchor);
        }
        activeBranch = value;
    });
}
//# sourceMappingURL=if.mjs.map