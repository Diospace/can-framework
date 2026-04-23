// Minimal Polyfill for SSR to support Web Components in Node.js

export function HTMLElement() {
    if (typeof (global as any).HTMLElement === 'undefined') {
        class MockNode {
            children: any[] = [];
            parentNode: any = null;
            textContent: string = '';
            
            appendChild(child: any) {
                if (child.nodeType === 11) { // DocumentFragment
                    child.children.forEach((c: any) => this.appendChild(c));
                    child.children = [];
                    return child;
                }
                child.parentNode = this;
                this.children.push(child);
                return child;
            }
            
            insertBefore(newNode: any, referenceNode: any) {
                const index = this.children.indexOf(referenceNode);
                if (index > -1) {
                    this.children.splice(index, 0, newNode);
                } else {
                    this.appendChild(newNode);
                }
                return newNode;
            }

            remove() {
                if (this.parentNode) {
                    const index = this.parentNode.children.indexOf(this);
                    if (index > -1) this.parentNode.children.splice(index, 1);
                }
            }
        }

        class MockHTMLElement extends MockNode {
            private _shadowRoot: any = null;
            attributes: Record<string, string> = {};
            tagName: string = 'DIV';
            style: Record<string, string> = {};
            
            classList = {
                add: (...args: string[]) => {
                    const existing = (this.attributes['class'] || '').split(' ').filter(Boolean);
                    args.forEach(c => { if (!existing.includes(c)) existing.push(c); });
                    this.attributes['class'] = existing.join(' ');
                },
                remove: (...args: string[]) => {
                    let existing = (this.attributes['class'] || '').split(' ').filter(Boolean);
                    existing = existing.filter(c => !args.includes(c));
                    this.attributes['class'] = existing.join(' ');
                },
                toggle: (token: string) => {
                    if (this.classList.contains(token)) {
                        this.classList.remove(token);
                        return false;
                    } else {
                        this.classList.add(token);
                        return true;
                    }
                },
                contains: (token: string) => (this.attributes['class'] || '').split(' ').includes(token)
            };

            get shadowRoot() {
                return this._shadowRoot;
            }

            get innerHTML(): string {
                return this.children.map(child => child.toString()).join('');
            }

            set innerHTML(val: string) {
                // Simple mock: treat string as text content
                this.children = [];
                this.textContent = val;
            }

            constructor(tagName: string = 'DIV') {
                super();
                this.tagName = tagName.toUpperCase();
            }

            attachShadow() {
                this._shadowRoot = new MockHTMLElement('SHADOW-ROOT');
                this._shadowRoot.parentNode = this;
                return this._shadowRoot;
            }

            getAttribute(name: string) { return this.attributes[name] || null; }
            setAttribute(name: string, value: string) { this.attributes[name] = value; }
            hasAttribute(name: string) { return Object.prototype.hasOwnProperty.call(this.attributes, name); }
            removeAttribute(name: string) { delete this.attributes[name]; }

            addEventListener() { }
            removeEventListener() { }
            dispatchEvent() { return true; }
            
            toString() {
                if (this.tagName === 'SHADOW-ROOT') return this.innerHTML;
                const attrs = Object.entries(this.attributes)
                    .map(([k, v]) => ` ${k}="${v}"`).join('');
                return `<${this.tagName.toLowerCase()}${attrs}>${this.innerHTML}</${this.tagName.toLowerCase()}>`;
            }
        }

        (global as any).Node = MockNode;
        (global as any).Element = MockHTMLElement;
        (global as any).HTMLElement = MockHTMLElement;
        (global as any).CustomEvent = class {
            constructor(public type: string, public init?: any) {}
        };

        (global as any).customElements = {
            get: () => undefined,
            define: () => { }
        };

        (global as any).document = {
            querySelector: () => null,
            createElement: (tag: string) => new MockHTMLElement(tag),
            createDocumentFragment: () => {
                const frag = new MockNode();
                (frag as any).nodeType = 11;
                return frag;
            },
            createTextNode: (text: string) => {
                const node = new MockNode();
                (node as any).toString = () => text;
                return node;
            },
            createComment: (text: string) => {
                const node = new MockNode();
                (node as any).toString = () => `<!--${text}-->`;
                return node;
            },
            body: new MockHTMLElement()
        };
        
        // Mock Window properties required by Router
        (global as any).window = global;
        if (!(global as any).location) {
            (global as any).location = { pathname: '/', search: '', hash: '' };
        }
        if (!(global as any).addEventListener) {
            (global as any).addEventListener = () => {};
        }
    }
}

// Polyfill fetch for Node.js versions that don't have it native (< 18)
export function fetch() {
    if (typeof (global as any).fetch === 'undefined') {
        try {
            // Try to use node-fetch if installed
            const nodeFetch = require('node-fetch');
            (global as any).fetch = nodeFetch;
            (global as any).Headers = nodeFetch.Headers;
            (global as any).Request = nodeFetch.Request;
            (global as any).Response = nodeFetch.Response;
        } catch (e) {
            (global as any).fetch = (_url: string, _options: any) => Promise.resolve({
                json: () => Promise.resolve({}),
                text: () => Promise.resolve(''),
                ok: true,
                status: 200
            });
        }
    }
}
