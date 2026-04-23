# Server Renderer Module

This module handles the conversion of Can Framework components into static HTML strings. It is primarily used by the CLI for Static Site Generation (SSG) and can be used for dynamic Server-Side Rendering (SSR).

## Core Functions

### `renderToString(ComponentClass, props)`
Executes a component's lifecycle in a server environment and returns the resulting HTML.
- **Lifecycle Awareness**: Automatically triggers `connectedCallback` and `disconnectedCallback`.
- **Reactivity Support**: Runs the reactive render effects to ensure the final HTML reflects the initial state.
- **Suspense Integration**: Aware of the `Suspense` component's `pendingCount` signal. It will pause extraction until all asynchronous dependencies (like `useFetch` in children) are resolved.

## Environmental Requirements

Since the framework utilizes native Web Component APIs (`HTMLElement`, `customElements`, `ShadowRoot`), this module requires a DOM shim to run in Node.js. 

We recommend using `linkedom` for performance or `jsdom` for full API compatibility.

## Future Roadmap
- **Declarative Shadow DOM (DSD)**: Support for rendering `<template shadowrootmode="open">` to allow Shadow DOM content to be parsed before JavaScript hydration.