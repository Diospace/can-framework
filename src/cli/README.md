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