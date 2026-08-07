# Router Module

This directory contains the client-side routing system for the Can Framework. It provides a lightweight Single Page Application (SPA) router that integrates with the framework's reactivity system.

## Core Modules

### `Router.ts`
The core router class.
- **`Router`**: Manages the routing state.
    - **`routes`**: An array of route definitions mapping paths to component constructors.
    - **`currentRoute`**: A reactive `signal` holding the current URL path.
    - **`push(path)` / `replace(path)`**: Methods to navigate programmatically.
    - **`matchedComponent`**: A getter that returns the component class for the current route.

### `history.ts`
Handles browser history integration.
- **`createWebHistory()`**: Creates a history object that wraps the native `window.history` API.
- Listens for `popstate` events (browser back/forward buttons) to update the router state.

### `RouterView.ts`
Contains the `<router-view>` component.
- **`RouterView`**: A custom element that acts as a placeholder for the routed component.
- Uses a reactive `effect()` to subscribe to the router's `currentRoute`. When the route changes, it automatically instantiates and mounts the matched component class.

### `RouterLink.ts`
Contains the `<router-link>` component.
- **`RouterLink`**: A custom element used for navigation links.
- Renders an `<a>` tag.
- Intercepts click events to prevent full page reloads and uses `router.push()` to update the state.

## Integration
The router uses the framework's Dependency Injection (`provide`/`inject`) system. A `Router` instance should be provided with the key `'router'`. Components can then use `useRouter()` or `useRoute()` to interact with the routing system.