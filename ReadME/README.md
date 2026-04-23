# Can Framework

A lightweight, compiler-first web framework that combines the performance of fine-grained reactivity with the interoperability of Web Components.

## Core Architecture

### 1. Compiler-First (`src/compiler`)
The framework uses a custom compiler to transform `.can` Single File Components (SFCs) into highly optimized JavaScript modules.
-   **No Virtual DOM**: The compiler generates imperative DOM instructions (`document.createElement`, `appendChild`).
-   **Fine-Grained Updates**: Dynamic bindings are wrapped in `effect()` calls. Only the specific nodes that depend on a signal are updated.
-   **Plugin System**: The compiler is extensible via plugins (e.g., `c-mount`, `c-show`) that can transform AST nodes or process directives.

### 2. Reactivity System (`src/reactivity`)
A standalone reactivity library based on Signals and Proxies.
-   **`signal(value)`**: Primitive reactive containers.
-   **`effect(fn)`**: Automatic dependency tracking and side-effect execution.
-   **`computed(fn)`**: Lazy, cached derived state.
-   **`reactive(obj)`**: Deep proxy-based reactivity for objects.

### 3. Runtime Core (`src/runtime-core`)
Provides the essential runtime logic for components.
-   **Web Components**: All Can components are compiled into standard Custom Elements (`HTMLElement`).
-   **Dependency Injection**: `provide` and `inject` API that works across Shadow DOM boundaries.
-   **Directives**: Runtime implementations for `c-if`, `c-for`, `c-model`, etc.
-   **Async Support**: Built-in `Suspense` and `defineAsyncComponent` for lazy loading.

## Ecosystem

-   **CLI (`src/cli`)**: Tools for scaffolding (`create`), building (`build`), serving with HMR (`dev`), and Static Site Generation (`ssg`).
-   **Router (`src/router`)**: A lightweight client-side router with history API support.
-   **Store (`src/store`)**: Centralized state management with actions and mutations.
-   **DevTools (`src/devtools`)**: Integration hooks for browser extension debugging.
-   **Server Renderer (`src/server-renderer`)**: Polyfills and logic for rendering components to HTML strings in Node.js.

## Project Structure

```
src/
├── cli/            # Command Line Interface
├── compiler/       # SFC Compiler & Plugins
├── components/     # Example Components
├── devtools/       # DevTools Bridge
├── reactivity/     # Signals & Effects
├── router/         # Client-side Routing
├── runtime-core/   # Component Lifecycle & Directives
├── runtime-dom/    # DOM Utilities
├── server-renderer/# SSR/SSG Logic
└── store/          # State Management
```