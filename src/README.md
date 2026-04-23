# Source Code

This directory contains the source code for the Can Framework. It is organized into several modules handling compilation, runtime logic, reactivity, and tooling.

## File Descriptions

### `runtime-helpers.ts`
This file serves as the main aggregation point (barrel file) for the framework's runtime library. It exports all public APIs from the sub-modules, making them easily accessible to the compiler and the end-user.

- **Exports**:
    - **Runtime Core**: `Component`, `apiCreateApp`, `apiInject`, directives (`cBind`, `cModel`, etc.).
    - **Reactivity**: `signal`, `effect`, `computed`, `reactive`.
    - **Runtime DOM**: `defineCustomElement`, `nextTick`.
    - **Ecosystem**: `Router`, `Store`, `devtools`.

## Usage Overview

The framework operates using a **Compiler-First** approach combined with a **Fine-Grained Reactivity** system.

1.  **Development**: You write Single File Components (`.can` files) containing your logic, template, and styles.
2.  **Compilation**: The CLI (`can build` or `can dev`) uses the **Compiler** to transform `.can` files into standard JavaScript modules (`.mjs`).
    -   Templates are compiled into imperative DOM instructions.
    -   Dynamic bindings (`{{ }}`) are wrapped in `effect()` calls.
    -   Styles are scoped and injected.
3.  **Runtime**: When the application runs in the browser:
    -   The **Runtime Core** initializes components as Web Components.
    -   The **Reactivity** system tracks dependencies. When a `signal` changes, only the specific `effect` associated with that part of the DOM re-runs, updating the UI efficiently without a Virtual DOM.

## Example `.can` File

Here is an example demonstrating the syntax and features of a Can component.

```html
<script>
  import { signal, computed } from '../reactivity';

  component CounterApp {
    // Reactive state
    var count = signal(0);

    // Computed state (derived from count)
    var double = computed(() => this.count.value * 2);

    // Method to update state
    function increment() {
      this.count.value++;
    }

    var template = `
      <div class="container">
        <h1>Count: {{ count }}</h1>
        <p>Double: {{ double }}</p>
        
        <!-- Event Binding -->
        <button @click="increment">Increment</button>

        <!-- Conditional Rendering -->
        <p c-if="count > 5" style="color: red;">
            Warning: Count is high!
        </p>
      </div>
    `;
  }
</script>

<style scoped>
  .container {
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  button {
    cursor: pointer;
    padding: 0.5rem 1rem;
  }
</style>
```