# Runtime DOM

This directory contains DOM-specific runtime utilities for the Can Framework. It bridges the core runtime with the browser's DOM API.

## File Descriptions

### `customElement.ts`
The core of the framework's Web Component integration.
- **`CanElement`**: The base class for all components.
    - **Shadow DOM**: Automatically attaches an open shadow root in the constructor.
    - **Reactive Props**: Maintains a `props` object that is automatically synchronized with HTML attributes via `attributeChangedCallback`.
    - **Lifecycle Orchestration**: Uses `connectedCallback` to trigger the initial render and `disconnectedCallback` to stop the `EffectScope`, ensuring all reactive effects and watchers are cleaned up when the element leaves the DOM.
    - **Scheduler Integration**: Uses `queueJob` to ensure DOM updates are batched into the next microtask, preventing layout thrashing.
- **`defineCustomElement`**: A robust wrapper for `customElements.define`. It handles:
    - **Registration Safety**: Prevents duplicate registration errors during HMR.
    - **Dynamic Injection**: Allows the compiler to inject template functions and `observedAttributes` without modifying the user's class.

### `nextTick.ts`
- **`nextTick(fn?)`**: A DOM-aware version of the core scheduler's `nextTick`. 
    - Returns a `Promise` that resolves once the current rendering batch is complete.
    - Essential for logic that needs to interact with the physical DOM after a state change (e.g., measuring element sizes or focusing inputs).

### `index.ts`
The entry point for the runtime-dom module. It provides a unified API for browser environments by aggregating:
- **`../runtime-core`**: The platform-agnostic runtime logic.
- **`../reactivity`**: The reactivity system.
- **Local DOM utilities**: `customElement` and `nextTick`.