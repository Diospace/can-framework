# Reactivity Module

This directory contains the core reactivity system of the Can Framework. It implements a fine-grained reactivity model using Signals and Proxies, inspired by modern frameworks like Vue and Solid.

## Core Modules

### `effect.ts`
The engine of the reactivity system. It handles dependency tracking and side-effect execution.
- **`effect(fn)`**: Registers a side effect that runs immediately and re-runs whenever its dependencies change.
- **`track(target, key)`**: Records a dependency between the currently running effect and a specific data property.
- **`trigger(target, key)`**: Notifies all effects depending on a specific property to re-run.
- **`EffectScope`**: Provides a way to group effects, computed properties, and watchers so they can be disposed of together (essential for component lifecycle cleanup).
- **`ReactiveEffect`**: The class wrapper for reactive functions.

### `signal.ts`
Implements **Signals**, the primitive unit of state in the framework.
- **`signal(initialValue)`**: Creates a reactive reference.
    - Reading `.value` calls `track()`.
    - Writing `.value` calls `trigger()`.
- **Microtask Batching**: Includes an internal scheduler that batches updates, ensuring that multiple state changes in a single synchronous block only trigger one re-render.
- Integrates with DevTools to log state changes via `devtools.emit`.

### `reactive.ts`
Implements **Proxy-based reactivity** for deep object observation.
- **`reactive(obj)`**: Returns a Proxy of the original object.
- **Deep Reactivity**: Automatically converts nested objects into reactive proxies.
- **Array Instrumentation**: Specialized handling for array methods (`push`, `pop`, `indexOf`, `includes`) to ensure correct dependency tracking and update triggering.
- **Property Deletion**: Uses the `deleteProperty` trap to trigger updates when keys are removed from an object.
- **Variations**: Includes `readonly`, `shallowReactive`, and `shallowReadonly` for fine-grained control over mutability and depth.

### `ref.ts`
A high-level wrapper for reactivity.
- **`ref(val)`**: If passed a primitive, it uses a signal. If passed an object, it makes it deeply reactive.
- **`toRefs(obj)`**: Converts a reactive object into a plain object where each property is a standalone ref (crucial for prop destructuring without losing reactivity).
- **`proxyRefs(obj)`**: A Proxy that automatically unwraps refs. This enables "auto-unwrapping" in component templates so users don't have to write `.value`.

### `watch.ts`
Implements **Watchers** for side effects.
- **`watch(source, callback, options)`**: Observes a signal or a getter.
- **Deep Watching**: Supports recursive traversal of objects to catch nested mutations.
- **Immediate/Flush Control**: Options to run the callback immediately or control whether it fires 'pre' or 'post' DOM updates.

### `computed.ts`
Implements **Computed Properties** (derived state).
- **`computed(getter)`**: Takes a getter function and returns a read-only reactive object.
- **Caching Mechanism**:
    1.  **Dirty Flag**: Uses a `_dirty` flag to track if the value needs re-computation. Initially `true`.
    2.  **Lazy Evaluation**: When `.value` is accessed, if `_dirty` is `true`, the getter runs, the result is cached, and `_dirty` becomes `false`.
    3.  **Dependency Tracking**: The computed property tracks its own dependencies. When a dependency changes, it triggers the computed property's effect, which resets `_dirty` to `true` (invalidating the cache) and notifies its own subscribers.

## Signal vs Reactive vs Ref

While these primitives enable reactivity, they serve different use cases:
- **`signal`**: Fine-grained primitive state. Access via `.value`.
- **`reactive`**: Best for complex state objects. Mutate properties directly. Note: Destructuring `reactive` objects breaks reactivity unless you use `toRefs`.
- **`ref`**: A "catch-all" wrapper. Provides a consistent `.value` API whether the data is a primitive or an object.

## Internal Mechanics

The reactivity system uses a global `targetMap` (a `WeakMap`) to store dependencies. 
1. **`track(target, key)`**: Called during a **read**. It maps the property to the currently active `ReactiveEffect`.
2. **`trigger(target, key)`**: Called during a **write** or **delete**. It looks up the associated effects and schedules them for execution.
3. **Scheduler**: updates are queued in a microtask. This prevents "jitter" where the UI updates multiple times for a single logical change.

- **`track(target, key)`**: This function is called whenever a reactive property is **read**.
    1.  It checks if there is an `activeEffect` (a side effect currently running).
    2.  If so, it looks up the `target` object in a global `targetMap`.
    3.  It adds the `activeEffect` to a `Set` of subscribers associated with the specific property `key`.
- **`trigger(target, key)`**: This function is called whenever a reactive property is **modified**.
    1.  It looks up the `target` object in the `targetMap`.
    2.  It retrieves the `Set` of effects subscribed to the specific property `key`.
    3.  It iterates through the set and executes each effect, causing the DOM (or other dependents) to update.0