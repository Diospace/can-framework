# Compiler Module

This directory contains the core logic for the Can Framework compiler. It is responsible for parsing `.can` Single File Components (SFCs), transforming the syntax tree, and generating the final JavaScript code that runs in the browser.

## File Descriptions

### `ast.ts`
Defines the Abstract Syntax Tree (AST) structure used to represent the template. It includes:
- **`NodeTypes`**: Enum defining node types: `Root`, `Element`, `Text`, and `Interpolation`.
- **`Node` Interface**: Represents a node in the tree with properties like `tag`, `props`, `children`, and structural directive info (`ifCondition`, `forLoop`, `elseNode`).
- **Helpers**: Functions like `createRoot`, `createElement`, `createText`, and `createInterpolation` for constructing the AST.

### `codegen.ts`
The heart of the transpiler. It orchestrates the entire compilation process:
1.  **SFC Parsing**: Uses `sfc.ts` to separate script, template, and styles.
2.  **Script Transformation**: Cleans up class syntax (removes `function` keywords, handles variable declarations) and maps `print()` to `console.log()`.
3.  **Template Compilation**: Converts the HTML template into imperative DOM manipulation code.
    - **`genChildren`**: Handles structural directives (`c-if`, `c-for`) by generating anchor comments and `effect()` wrappers for dynamic DOM insertion.
        - **Loop Scoping**: When processing `c-for="item in items"`, it pushes the alias (`item`) and `index` into the `locals` array. This array is passed down during recursion, ensuring `processExpression` treats them as local variables instead of component signals (preventing transformation to `this.item.value`).
    - **`genSingleNode`**: Generates code for creating elements/text, handling interpolation (`{{ }}`), and processing attributes.
4.  **Reactivity**: Automatically wraps dynamic bindings and expressions in `effect()` calls.
    - **`processExpression(expr, locals)`**: This critical function transforms template expressions into reactive JavaScript code.
        1.  **String Masking**: Temporarily hides string literals to prevent accidental replacement.
        2.  **Identifier Resolution**: Scans for variables using the regex `/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g`. It ignores JS keywords (`true`, `null`, etc.) and local variables defined in `locals`.
        3.  **Context Awareness**: It avoids replacing object properties by checking the preceding characters. If the match is preceded by a dot (`.`), it is treated as a property access (e.g., `user.name`) and left alone.
        4.  **Runtime Optimization**: Leverages `proxyRefs` at runtime. The compiler simply injects `this.` prefixes, and the runtime proxy handles the `.value` unwrapping, resulting in much cleaner generated code.
5.  **Plugin Integration**: Applies compiler plugins during code generation via the `processDirective` hook.
6.  **Output**: Assembles the final JavaScript class extending `Component`, including imports and style injection.

### `parser.ts`
Responsible for parsing raw HTML template strings into the custom AST defined in `ast.ts`.
- Uses `htmlparser2` for robust HTML parsing.
- Handles void tags (e.g., `input`, `br`) correctly.
- Filters out insignificant whitespace to optimize the AST.

### `sfc.ts`
Handles the parsing of Single File Components (`.can` files).
- **`parse(source, filename)`**: Extracts the component name, imports, script body, template string, and styles.
- **Prop Extraction**: Automatically detects `var props = [...]` or typed prop objects and populates the `observedAttributes` of the custom element.
- **Scope ID**: Generates a unique hash based on the filename for scoped CSS encapsulation.
- Returns an `SFCDescriptor` containing the separated parts of the component.

### `transform.ts`
Performs AST transformations before code generation. It traverses the tree to:
- **Structural Directives**: processing `c-if`, `c-else-if`, `c-else` (linking else nodes to if nodes), and `c-for`.
- **Shorthands**: Expands `:` to `c-bind`, `@` to `c-on`, and `#` to `c-slot`.
- **Class Merging**: Merges static `class` attributes with dynamic `c-bind:class`.
- **Scoped Styles**: Adds the unique data attribute (e.g., `data-v-xxxx`) to elements if scoped styles are present.
- **Plugin Hooks**: Executes `transformNode` hooks from registered plugins to allow custom AST modifications.

### `stylePlugin.ts`
Handles the compilation of component styles.
- **`compileStyle(css, scopeId)`**: Uses PostCSS to implement CSS scoping.
- Rewrites CSS selectors to include the component's unique attribute (e.g., `.my-class` becomes `.my-class[data-v-scopeId]`).

### `plugin.ts`
Defines the `CompilerPlugin` interface, which allows the compiler to be extended. Plugins can hook into:
- **`transform`**: Raw source code transformation (pre-parsing).
- **`transformNode`**: AST transformation (post-parsing, pre-codegen).
- **`processDirective`**: Custom code generation for specific attributes/directives.

### `c-mount-plugin.ts`, `on-update.ts`, `c-show-plugin.ts` & `button-class-plugin.ts`
Built-in compiler plugins that implement framework directives and transformations using the plugin system:
- **`c-mount-plugin.ts`**: Uses `transformNode` to rewrite `c-mount="handler"` into `c-ref="(el) => this.handler(el)"`.
- **`on-update.ts`**: Uses `processDirective` to implement `c-update`, generating `effect(() => { ... })` for side effects when dependencies change.
- **`c-show-plugin.ts`**: Implements the `c-show` directive, toggling element visibility based on a reactive expression.
- **`button-class-plugin.ts`**: A sample plugin demonstrating `transformNode` by automatically appending a `btn` class to all `<button>` elements.

### `index.ts`
The entry point for the compiler module. It exports all necessary functions, types, and default plugins for use by the CLI or other tools.