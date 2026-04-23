# CLI Tooling

This directory contains the source code for the Can Framework Command Line Interface (CLI). It provides the essential tools for creating, building, serving, and generating static sites for Can applications.

## File Descriptions

### `build.ts`
This script handles the compilation of the project. It recursively traverses the source directories, transpiling `.can` files (using the custom compiler) and `.ts` files (using TypeScript) into standard ES Modules (`.mjs`) outputted to the `dist/` directory. It also handles import path adjustments for the build artifacts.
- **Incremental Compilation**: Compares file modification times (`mtime`) to skip files that haven't changed, significantly speeding up the build process.
- **Fresh Builds**: Supports the `--clear` flag to wipe the `dist/` directory before starting.
- **Targeted Builds**: Can process a single file, which is used by the dev server for near-instant updates.

### `create.ts`
This is the scaffolding tool. When you run `can create <project-name>`, this script generates a new project structure. It creates the necessary directories (`src`, `components`), a default `package.json`, and a starter `App.can` component to help you get started quickly.

### `serve.ts`
This script powers the development server. It:
1.  Runs an initial build.
2.  Starts an HTTP server to serve the static files from the project.
3.  Watches the `src` directory for file changes.
4.  Triggers a rebuild and notifies connected browsers via Server-Sent Events (SSE) to reload the page (Hot Module Replacement/Live Reload).
- **Style HMR**: Detects changes in `.can` files and attempts to hot-swap styles without a full page reload by re-evaluating the module with a cache-buster.

### `ssg.ts`
This script implements **Static Site Generation**. It demonstrates how to render components to HTML strings on the server side (Node.js) and save them as static `.html` files in the `dist/` directory. This is useful for SEO and performance optimization.

### `index.ts`
The entry point for the CLI binary. It parses command-line arguments (e.g., `build`, `dev`, `create`, `ssg`) and dispatches execution to the corresponding handler functions defined in the other files.

## Usage

These tools are typically invoked via the `can` command defined in the root `package.json` bin entry.


. Compiler Used
.can files: Are processed using the framework's custom compiler. The transpile function is imported from ../compiler/codegen. This function handles parsing the Single File Component (SFC) structure (template, script, style), compiling the HTML template to imperative DOM code, and injecting styles.
.ts files: Are processed using the standard TypeScript compiler API. The script uses ts.transpileModule to convert TypeScript syntax into ESNext JavaScript.
2. Plugins
.can files: The build process explicitly injects specific compiler plugins (cMountPlugin and onUpdatePlugin) during transpilation. These plugins handle framework-specific directives like c-mount and c-update.
.ts files: No custom plugins are applied; it performs a standard TypeScript-to-JavaScript conversion.
3. Import Path Rewriting
.can files: The custom compiler (codegen.ts) generates the import statements. build.ts only performs a specific fix for relative paths if the file is inside an examples directory.
.ts files: build.ts performs a regex replacement on the output code to ensure all local imports end with .mjs (.replace(/from '(\..+?)'/g, "from '$1.mjs'")). This is necessary because TypeScript often emits imports without extensions or with .js extensions, but the output format here is ES Modules (.mjs).
4. Output
Both file types are outputted to the dist/ directory with the .mjs extension, mirroring the source directory structure.



ased on the code provided in src/compiler/on-update.ts, the onUpdatePlugin is responsible for handling the c-update directive in your templates.

Here is a breakdown of what it does:

Detects c-update: It hooks into the compilation process via processDirective. When the compiler encounters an attribute named c-update on an element, this plugin intercepts it.
Processes the Expression: It takes the value of the directive (e.g., c-update="console.log(count)") and passes it through processExpression. This transforms local variables into signal references (e.g., count becomes this.count.value).
Generates Reactive Code:
Dynamic Mode: By default, it wraps the code in an effect(). This ensures that the code runs immediately and re-runs automatically whenever any reactive signals used inside it change.
Static Mode: If the element is marked as static (e.g., inside a c-once block), it generates the code without the effect wrapper, meaning it only runs once during component creation.
Example Transformation:

Input in .can file:

html
<div c-update="console.log('Count changed:', count)"></div>
    

Generated JavaScript (Dynamic):

javascript
effect(() => { console.log('Count changed:', this.count.value) });




     "dev": "tsx node_modules/.bin/can dev",
            "build": "tsx node_modules/.bin/can build",
            "serve": "tsx node_modules/.bin/can serve"

             "dev": "can dev",
            "build": "can build",
            "serve": "can serve"