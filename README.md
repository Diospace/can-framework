# Can Framework

A modern, high-performance web framework designed for building reactive applications with **Single File Components (.can)**. Can combines the simplicity of signal-based reactivity with a powerful CLI and a built-in compiler.

## 🚀 Features

- **Signal-Based Reactivity**: Fine-grained updates without a Virtual DOM.
- **Single File Components**: Write logic, templates, and scoped styles in `.can` files.
- **Powerful CLI**: Integrated tools for building, serving (HMR), and scaffolding.
- **Static Site Generation (SSG)**: Pre-render your app for maximum SEO and speed.
- **First-Class Tooling**: Custom VS Code extension for syntax highlighting and snippets.
- **Built-in Essentials**: Store management, I18n, Animations, and Routing.

## 📦 Installation

Clone the repository and install dependencies:

```bash
npm install
npm run build   # Cleans dist/, compiles the core + CLI, and bundles CDN assets
```

> **Note**: `npm run build` **always starts from a clean `dist/` directory**. The build
> purges `dist/` first and then runs an incremental compilation, so stale build artifacts
> can never slip into a published package. The CLI binary is produced at
> `dist/bundler/index.mjs`.

## 📦 Dependency Layout

The published package is intentionally dependency-light:

- **Toolchain & runtime** (`dependencies`): `esbuild`, `htmlparser2`, `postcss`, `typescript`
  — required by the CLI, the `.can` compiler, and the runtime.
- **API server** (`optionalDependencies`): `express`, `cors`, `jsonwebtoken`, `bcryptjs`,
  `pg`, `typeorm`, `reflect-metadata` — only needed when you use the built-in API server
  (see `api/`). Installed by default; skip them with `npm install --omit=optional`.
- **IDE / tooling** (`devDependencies`): everything used to build and test the framework
  and the VS Code extension (`prettier`, `png-to-ico`, `vscode-*`, webpack, vitest, …).
  Never shipped to consumers.

## 🛠️ CLI Usage

Once compiled, you can use the `can` command to manage your projects:

- **Create a new project**: `can create <my-app>`
- **Start dev server (HMR)**: `can dev`
- **Production build**: `can build`
- **Generate Static Site**: `can ssg`

## 🧩 Component Example

```javascript
component Counter {
    var count = signal(0);
    
    function increment() {
        this.count.value++;
    }

    var template = `
        <div class="box">
            <h1>Count: {{count}}</h1>
            <button @click="increment">Increment</button>
        </div>
    `;
}

<style scoped>
.box { padding: 20px; border-radius: 8px; }
</style>
```

## 🛠️ Internal Architecture

- **/src/compiler**: The core transpiler for `.can` files.
- **/src/runtime-core**: The base component class and DOM orchestration.
- **/src/reactivity**: The signal and effect engine.
- **/ide-extension**: Source for the VS Code extension.

## 👤 Author & Maintainer

The Can Framework and its tooling are developed and maintained by **Endurance Ogun**, a software engineer dedicated to building high-performance, developer-centric web technologies. 

Endurance focuses on compiler-driven architectures and fine-grained reactivity to push the boundaries of modern web performance.

- **GitHub**: [Diospace](https://github.com/Diospace)
- **Project**: Can Framework

## 🔖 Releasing

Releases are handled by `scripts/release.js`. Recommended flow:

```bash
# 1. Commit your work first (the release script refuses uncommitted changes)
git add .
git commit -m "feat: describe your change"

# 2. Bump the version (creates a commit and tag locally)
npm version patch   # or minor / major

# 3. Publish (clean build → npm publish → git push + tags)
npm run release
```

`npm run release` also verifies you are logged into npm (`npm whoami`) and that you are on
the `main` branch. It runs the **clean** build pipeline, publishes to npm, creates the
version tag, and pushes everything to GitHub. Run `npm test` beforehand to validate the
release candidate.

