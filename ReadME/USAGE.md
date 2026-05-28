# Can Framework - Usage Guide

This guide provides step-by-step instructions on how to use the Can Framework to build applications, run demos, and utilize its core features.

## 1. Installation & Setup

Since you are working within the framework's source repository:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Compile the Framework**:
    Before running any code, you must compile the TypeScript and `.can` source files.
    ```bash
    npm run compile
    ```
    This generates the `dist/` folder containing the executable ES modules.

## 2. CLI Tools

The framework includes a Command Line Interface (CLI) located at `src/cli/index.ts`. After compilation, you can run it using Node.js.

### Creating a New Project
To scaffold a new project structure:

```bash
node dist/bundler/index.mjs create my-new-app
```

### Static Site Generation (SSG)
To pre-render your application to static HTML files:

```bash
npm run ssg
# OR
node dist/cli/index.mjs ssg
```

## 3. Running Demos

We have provided several demos in the `test/` folder to showcase specific features. These run in a Node.js environment with a simulated DOM.

1.  **Basic App**: `node test/run_demo.mjs`
2.  **Signals (Fine-Grained)**: `node test/run_signal_demo.mjs`
3.  **Routing**: `node test/run_router_demo.mjs`
4.  **Server-Side Rendering**: `node test/run_ssr_demo.mjs`
5.  **Web Components**: `node test/run_web_component_demo.mjs`

## 4. Writing Components

Components are written in `.can` files. They combine logic (Script) and UI (Template).

**`src/components/MyComponent.can`**
```javascript
import { signal } from '../reactivity/signal.mjs';

component MyComponent {
    // Reactive State
    var count = signal(0);

    // Methods
    function increment() {
        this.count.value++;
    }

    // Template
    var template = `
        <div class="container">
            <h1>Counter: {{count}}</h1>
            <button onclick="increment()">Add</button>
        </div>
    `;
}

// Scoped CSS
<style scoped>
.container { color: blue; }
</style>
```

## 5. Feature Reference

### Reactivity
Use `signal` for fine-grained updates. The compiler automatically binds these to the DOM.

```javascript
var text = signal("Hello");
// In template: <p>{{text}}</p>
```

### Directives
- **`c-if`**: Conditional rendering.
  ```html
  <div c-if="isVisible">I am visible</div>
  ```
- **`c-for`**: List rendering.
  ```html
  <li c-for="item in items">{{item}}</li>
  ```
- **`c-model`**: Two-way data binding (for inputs).
  ```html
  <input c-model="username" />
  ```
- **`c-html`**: Render trusted HTML (use with caution).
  ```html
  <div c-html="rawHtmlContent"></div>
  ```

### Routing
Use `RouterView` to display the current route component and `RouterLink` for navigation.

```javascript
import { RouterView, RouterLink } from '../router/index.mjs';
// In template:
// <RouterLink to="/about">Go to About</RouterLink>
// <RouterView />
```

### State Management (Store)
Use the global store for shared state.

```javascript
import { createStore } from '../store/Store.mjs';

const store = createStore({
    state: () => ({ count: 0 }),
    mutations: {
        increment(state) { state.count++; }
    }
});
```

### Forms
Use the built-in `<Form>` and `<Input>` components for validation.

```javascript
import { Form, Input } from '../runtime-core/formComponents.mjs';
// In template:
// <Form onSubmit="{submitHandler}">
//   <Input name="email" rules="required|email" />
// </Form>
```

### Internationalization (i18n)
Use the `t` attribute for automatic translation.

```html
<p t="welcome_message"></p>
```

### Animations
Use the `animate:` directive for declarative animations.

```html
<div animate:fade="{ show }">Fading Content</div>
```