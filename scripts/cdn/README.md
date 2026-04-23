# Scripts Module (CDN & Runtime)

This directory contains logic for using the Can Framework directly in the browser without a build step.

## Files

- **`cdn.ts`**: The entry point for the browser bundle. It exports the `Can` global object.
- **`runtime-compiler.ts`**: Implements a lightweight DOM crawler that enables directives and interpolation in plain HTML.

## CDN Usage Example

```html
<script src="https://unpkg.com/can-framework/dist/can.global.js"></script>

<div id="app">
    <h1>{{ title }}</h1>
    <button @click="count++">Count is: {{ count }}</button>
    <div c-show="count > 5">You reached 5!</div>
</div>

<script>
    const { createApp } = Can;
    createApp({
        title: 'Hello Can CDN!',
        count: 0
    }).mount('#app');
</script>
```
















<div id="app">
  <h1>{{ title }}</h1>
  <p>Count is: {{ count }}</p>
  <p>Double is: {{ doubleCount }}</p>
  <button @click="increment">Increment</button>
  <div c-if="count > 5">You reached a high score!</div>
</div>

<script src="path/to/can.runtime.min.js"></script>
<script>
  const { createApp } = Can;

  createApp({
    data() {
      return { 
        title: 'Hello Can Framework!',
        count: 0 
      };
    },
    computed: {
      doubleCount() {
        return this.count * 2;
      }
    },
    methods: {
      increment() {
        this.count++;
      }
    },
    mounted() {
      console.log('App is ready!');
    }
  }).mount('#app');
</script>


To create your main bundle: npm run build:bundle
To create your CDN version: npm run build:cdn
npm run build:cdn:all
To run your tests: npm run test



npx webpack --config webpack.config.cdn.js

