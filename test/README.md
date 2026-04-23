# Test Suite


This directory contains unit and integration tests for the Can Framework, powered by Vitest.


## Environment
Tests run in a simulated browser environment using `happy-dom`. This allows us to test Web Components, Shadow DOM, and DOM events in a Node.js environment.


## Commands

### Run a single test
```bash
npm test -- test/your-test-file.ts
```

### Run all tests
```bash
npm test
```


### Watch mode
```bash
npx vitest
```


## Structure
- `reactivity.test.ts`: Verifies signals, effects, computed, and the dependency tracking engine.
- `component.test.ts`: Verifies the Web Component base class, lifecycle hooks, and rendering pipeline.
