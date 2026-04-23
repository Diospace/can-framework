# Store Module

This directory contains the state management system for the Can Framework. It provides a centralized, reactive data store inspired by Vuex and Pinia.

## Core Primitives

### `Store` Class
The central authority for application state.
- **`state`**: A reactive `signal` containing the current state object.
- **`commit(type, payload)`**: The only way to modify state. Mutations must be synchronous.
- **`dispatch(type, payload)`**: Used for asynchronous logic or complex operations that may trigger multiple mutations.

### `createStore(options)`
A factory function to instantiate a new `Store`. 
```typescript
const store = createStore({
  state: () => ({ count: 0 }),
  mutations: {
    increment(state) { state.count++ }
  }
});
```

### `useStore()`
A composable hook to access the store instance within any component. It leverages the framework's Dependency Injection system.

## DevTools Integration
The store is fully integrated with the Can DevTools. Every `commit` and `dispatch` event is broadcasted, allowing for:
- State snapshotting for time-travel debugging.
- Mutation tracking and history.
- Action logging.