import { createComponent } from "./componentUtils.mjs";
export const Fragment = Symbol('Fragment');
export function h(type, props = {}, children = []) {
    let el;
    if (type === Fragment) {
        el = document.createDocumentFragment();
    }
    else if (typeof type === 'string') {
        el = document.createElement(type);
    }
    else {
        // Component Class
        el = createComponent(type, props);
    }
    // Handle Props
    if (type !== Fragment && props) {
        for (const key in props) {
            if (key.startsWith('on')) {
                const event = key.slice(2).toLowerCase();
                el.addEventListener(event, props[key]);
            }
            else if (key in el) {
                // Property
                try {
                    el[key] = props[key];
                }
                catch (e) {
                    el.setAttribute(key, String(props[key]));
                }
            }
            else {
                // Attribute
                el.setAttribute(key, String(props[key]));
            }
        }
    }
    // Handle Children
    const kids = Array.isArray(children) ? children : [children];
    kids.forEach((child) => {
        if (typeof child === 'string' || typeof child === 'number') {
            el.appendChild(document.createTextNode(String(child)));
        }
        else if (child instanceof Node) {
            el.appendChild(child);
        }
        else if (Array.isArray(child)) {
            child.forEach((c) => el.appendChild(c));
        }
    });
    return el;
}
//# sourceMappingURL=h.mjs.map