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
npm run compile # Compiles the framework core and CLI
```

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


 #"compile": "ts-node src/cli/build.ts"




    "compile:all": "esbuild src/**/*.ts examples/**/*.ts --platform=node --format=esm --outdir=dist --out-extension:.js=.mjs",


 "can": "node ./dist/index.mjs",
 "compile": "esbuild src/cli/index.ts --bundle --platform=node --format=esm --outfile=dist/index.mjs --external:esbuild --banner:js=\"#!/usr/bin/env node\"",
    "compile:all": "node dist/index.mjs build",
 

 
try {
    // 1. Ensure the CLI is compiled before attempting to run it or type-check.
    const cliEntry = path.resolve(__dirname, '../dist/index.mjs');
    if (!fs.existsSync(cliEntry)) {
        console.log('\x1b[33m%s\x1b[0m', '>>> dist/index.mjs not found. Bootstrapping CLI tool...');
        execSync('npm run compile', { stdio: 'inherit' });
    }

   
  