# Shared Module

This directory contains utility functions and constants that are shared between the compiler and the runtime packages of the Can Framework.

## File Descriptions

### `utils.ts`
Provides string manipulation utilities.
- **`escapeHtml(string)`**: A utility function to escape HTML entities (`"`, `'`, `&`, `<`, `>`). This is used to prevent Cross-Site Scripting (XSS) attacks when rendering dynamic content into the DOM.
    - **Implementation Details**:
        1.  **Fast Path**: It first checks if the string contains any dangerous characters using a regular expression (`/["'&<>]/`). If not, it returns the original string immediately.
        2.  **Efficient Replacement**: If escaping is needed, it iterates through the string starting from the first match. It uses `charCodeAt` to identify characters (for performance) and builds a new string by appending safe substrings and escaped entities.
    - **`extend`**: A performant alias for `Object.assign` used for object merging.
    - **`NOOP`**: A reusable empty function reference.

### `index.ts`
The shared module acts as a common dependency for other framework packages.
- **Usage**: It is imported by modules like `reactivity` (e.g., `import { hasChanged, isObject } from '../shared'`) to perform basic type checks and value comparisons.
- **Purpose**: Centralizes common logic to reduce code duplication and ensure consistency.
- **Type Guards**: Includes `isObject`, `isFunction`, `isString`, and `isArray` for safe runtime type assertions.