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

## Building

- **Main bundle**: `npm run build:bundle` (webpack)
- **CDN bundles**: `npm run build:cdn` and `npm run build:cdn:modern` (or `npm run build:cdn:all` for both)
- **Tests**: `npm run test`

The full `npm run build` pipeline (used by `npm run release`) builds all CDN assets into `dist/build/cdn/`.
