import { getComponentTagName } from '../runtime-dom/customElement';

export function createComponent(Constructor: any, props: any) {
    // HTMLElement subclasses cannot be constructed with `new` — create the
    // element through the custom elements registry instead.
    const instance = document.createElement(getComponentTagName(Constructor)) as any;
    if (props) {
        // Merge props into the reactive props object so reactive updates
        // triggered from the parent are tracked by the child's render effect.
        Object.assign(instance.props, props);
    }
    return instance;
}