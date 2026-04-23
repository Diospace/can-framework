# Runtime Core

This directory contains the runtime logic of the Can Framework. It handles component creation, lifecycle, directives, reactivity integration, and DOM manipulation.

## File Descriptions

### `animation.ts`
Handles CSS transitions and Web Animations API integrations.
- **`enter(el, transitionClass)`**: Applies enter transition classes (`-enter-from`, `-enter-active`, `-enter-to`) to an element.
- **`leave(el, transitionClass, done)`**: Applies leave transition classes and calls the `done` callback upon completion.
- **`animate(params)`**: A wrapper around the Web Animations API (`el.animate`). Supports keyframes, duration, delay, easing, and looping.
- **`stagger(amount, options)`**: Helper function to create staggered delays for lists.
- **`cAnimate(el, value)`**: Directive handler that applies animations to an element based on the provided configuration.

### `apiCreateApp.ts`
The entry point for creating an application.
- **`createApp(rootComponent)`**: Creates and returns an `App` instance. It sets up the application context, plugin system, and `mount` method.
- **`App` Interface**: Defines the public API of the app (`use`, `mount`, `provide`, `config`).
- **`Plugin` Type**: Defines the structure for plugins (functions or objects with an `install` method).

### `apiLifecycle.ts`
Provides the Composition API style lifecycle hooks.
- **`onBeforeMount`, `onMounted`, `onUnmounted`, `onErrorCaptured`**: Allows registering callbacks that hook into the component's lifecycle during its connection or disconnection from the DOM.

### `apiInject.ts`
Implements the Dependency Injection system.
- **`provide(key, value)`**: Provides a value to the current component instance's descendants.
- **`inject(key, defaultValue)`**: Injects a provided value from an ancestor component.

### `apiMemo.ts`
- **`memo(component, compareFn)`**: A Higher-Order Component (HOC) utility to mark a component for memoization, potentially skipping updates if props haven't changed.

### `asyncComponent.ts`
- **`defineAsyncComponent(loader)`**: Creates a wrapper component that lazily loads the actual component from a Promise (e.g., dynamic import). It integrates with `Suspense` to handle loading states.

### `bind.ts`
Implements the `c-bind` (or `:`) directive.
- **`cBind(el, name, value)`**: Reactively binds attributes, classes, or styles to an element.
    - **Two-Way Binding**: Automatically detects `Signal` values for interactable attributes (like `value` or `checked`) and establishes bidirectional synchronization between the state and the view.
    - **Reactivity Integration**: Uses fine-grained effects to keep attributes in sync with signal changes and template interpolations.
    - **Smart Normalization**: Intelligent merging and formatting for `class` and `style` bindings.

### `Component.ts`
The base class for all framework components.
- **`Component`**: Extends `HTMLElement`.
    - **`connectedCallback()`**: Initializes the component, sets up dependency injection, calls lifecycle hooks (`onBeforeMount`, `onMounted`), and renders the template into the Shadow DOM.
    - **`render()`**: Injects the compiled template into the shadow root.
    - **`provide()` / `inject()`**: Methods for DI.
    - **Cross-Shadow DOM Injection**: The `inject` method implements a custom DOM tree walker. When traversing up, if it encounters a Shadow Root (where `parentElement` is null), it retrieves the `host` element to continue the search in the parent scope. This allows deeply nested components inside Shadow DOMs to access values provided by ancestors in the light DOM.

### `componentUtils.ts`
Internal utilities for component management.
- **`createComponent(Constructor, props)`**: Helper to instantiate components and correctly assign reactive properties before mounting.

### `errorHandling.ts`
Centralized error handling mechanism.
- **`callWithErrorHandling(fn, instance, type, args)`**: Executes a function and catches synchronous errors, passing them to `handleError`.
- **`callWithAsyncErrorHandling(fn, ...)`**: Handles errors for async functions (Promises).
- **`handleError(err, instance, type)`**: Propagates errors up the component tree to `onErrorCaptured` hooks or the global `app.config.errorHandler`.

### `form.ts`
Reactive form state management.
- **`createForm(config)`**: Creates a form object with reactive state (`values`, `errors`, `touched`, `isSubmitting`).
    - **`registerField`**: Adds a field to the form state.
    - **`validate`**: Runs validation rules.
    - **`submit`**: Handles form submission and validation.

### `formComponents.ts`
Built-in components for forms.
- **`Form`**: A wrapper component that provides the form context to its children.
- **`FormInput`**: An input component that automatically connects to the parent `Form` context.

### `h.ts`
The virtual-to-real DOM bridge.
- **`h(type, props, children)`**: A hyperscript function that produces real DOM elements. It handles standard HTML tags, framework components, and `Fragments` while automatically setting up event listeners and attribute bindings.

### `html.ts`
- **`cHtml(el, value)`**: Implements the `c-html` directive. Updates `innerHTML` reactively and performs basic sanitization to prevent XSS.

### `i18n.ts`
Internationalization plugin.
- **`createI18n(options)`**: Creates an i18n instance with a reactive `locale` and a translation function `t`.

### `if.ts`
- **`cIf(parent, condition, render, elseRender)`**: Implements the `c-if` structural directive. It uses an anchor comment and `effect` to conditionally insert or remove DOM nodes based on a signal.

### `list.ts`
- **`cFor(parent, signal, render, keyFn)`**: Implements the `c-for` structural directive. It renders a list of items based on a signal array, handling efficient DOM updates and reordering.
    - **Efficient Reordering Strategy**:
        1.  **Node Reuse**: It maintains a map of existing DOM nodes keyed by unique IDs. When the list changes, it tries to reuse existing nodes instead of recreating them.
        2.  **Cursor-based Reordering**: It iterates through the new list order and maintains a cursor in the DOM. If the next sibling of the cursor is not the expected node, it moves the node to the correct position using `insertBefore`.
        3.  **Cleanup**: Any nodes remaining in the old map that weren't reused are removed from the DOM.

### `microApp.ts`
- **`createMicroApp(options)`**: Helper to mount a separate application instance (micro-frontend) into a container, optionally using Shadow DOM for style isolation. Includes an event bridge for communication.

### `model.ts`
- **`cModel(el, signal)`**: Implements `c-model` for two-way data binding on form inputs (`input`, `checkbox`, `radio`, `select`).

### `on.ts`
- **`cOn(el, event, handler, modifiers)`**: Implements the `c-on` (or `@`) directive. Attaches event listeners with support for modifiers like `.stop`, `.prevent`, `.once`, etc.

### `Cref.ts`
- **`cRef(el, ref)`**: Implements the `c-ref` directive. Assigns the DOM element to a variable, a signal callback, or a signal's `.value` property.

### `scheduler.ts`
The orchestration engine for the framework's internal "heartbeat."
- **Unified Batching**: Consolidates all reactive updates and internal framework tasks into a single microtask-based job queue.
- **Deduplication**: Uses `Set` logic to ensure that multiple state changes in a single synchronous block result in only one DOM update cycle.
- **`nextTick(fn?)`**: A centralized implementation that allows developers to wait for the next full flush cycle, ensuring the DOM is perfectly in sync with the state.

### `show.ts`
- **`cShow(el, signal)`**: Implements the `c-show` directive. Toggles the element's visibility (`display: none`) based on a boolean signal.

### `Suspense.ts`
- **`Suspense`**: A built-in component that orchestrates async dependencies (like `defineAsyncComponent`). It renders a fallback slot while dependencies are resolving.
    - **Slot Distribution**: It overrides the `appendChild` method of its root container. This allows it to intercept children being appended by the compiler-generated code and distribute them into internal `default` or `fallback` slots based on the `slot` attribute.

### `Teleport.ts`
- **`Teleport`**: A built-in component that renders its content into a different part of the DOM (specified by the `to` prop) while maintaining the logical component hierarchy.

### `index.ts`
Exports all public APIs and components from the runtime-core module.