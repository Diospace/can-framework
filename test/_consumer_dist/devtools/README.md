# DevTools Module

This module provides the bridge between the Can Framework internals and the browser inspection tools.

## Internal Bridge
The framework emits events to `window.__CAN_DEVTOOLS__`. 

## Tracked Events
- `component:mount`: Tracks when a component enters the DOM.
- `component:unmount`: Tracks when a component is destroyed.
- `signal:init`: Allows inspection of all reactive state units.
- `signal:update`: Powers "Time Travel" debugging and state change logging.
- `effect:trigger`: Helps identify which signals caused a specific re-render.