import { Component, effect, defineCustomElement } from '../can-framework.mjs'; // Placeholder for build.ts to replace
const _scopeId = 'prwqgf';
let _style = document.querySelector(`style[data-can-scope="${_scopeId}"]`);
if (!_style) {
    _style = document.createElement('style');
    _style.setAttribute('data-can-scope', _scopeId);
    document.head.appendChild(_style);
}
_style.textContent = `.hello-box[data-v-prwqgf] { text-align: center; margin-top: 2rem; }
.links[data-v-prwqgf] { margin-top: 1rem; }
.links a[data-v-prwqgf] { color: #42b883; margin: 0 10px; text-decoration: none; font-weight: bold; }`;
const _kebabName = 'HelloWorld'.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const _tagName = _kebabName.includes('-') ? _kebabName : 'can-' + _kebabName;
const _rawProps = ["msg"];
const _observedAttrs = _rawProps.map(p => p.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase());
const _baseClass = Component;
const _elementOptions = {};
export class HelloWorld extends _baseClass {
    static get observedAttributes() { return _observedAttrs; }
    static get defaultProps() { return {}; }
    static get propDefinitions() { return {}; }
    render() {
        const root = document.createDocumentFragment();
        const el0 = document.createElement("div");
        el0.setAttribute("class", "hello-box");
        el0.setAttribute("data-v-prwqgf", "");
        root.appendChild(el0);
        const el1 = document.createElement("h2");
        el1.setAttribute("data-v-prwqgf", "");
        el0.appendChild(el1);
        const txt2 = document.createTextNode("");
        effect(() => txt2.data = `${this.msg}`);
        el1.appendChild(txt2);
        const el3 = document.createElement("p");
        el3.setAttribute("data-v-prwqgf", "");
        el0.appendChild(el3);
        const txt4 = document.createTextNode("Edit ");
        el3.appendChild(txt4);
        const el5 = document.createElement("code");
        el5.setAttribute("data-v-prwqgf", "");
        el3.appendChild(el5);
        const txt6 = document.createTextNode("src/App.can");
        el5.appendChild(txt6);
        const txt7 = document.createTextNode(" to start building your application.");
        el3.appendChild(txt7);
        const el8 = document.createElement("div");
        el8.setAttribute("class", "links");
        el8.setAttribute("data-v-prwqgf", "");
        el0.appendChild(el8);
        const el9 = document.createElement("a");
        el9.setAttribute("href", "https://github.com/can-framework");
        el9.setAttribute("target", "_blank");
        el9.setAttribute("data-v-prwqgf", "");
        el8.appendChild(el9);
        const txt10 = document.createTextNode("Documentation");
        el9.appendChild(txt10);
        const el11 = document.createElement("a");
        el11.setAttribute("href", "https://github.com/can-framework");
        el11.setAttribute("target", "_blank");
        el11.setAttribute("data-v-prwqgf", "");
        el8.appendChild(el11);
        const txt12 = document.createTextNode("GitHub");
        el11.appendChild(txt12);
        return root;
    }
}
HelloWorld.extends = null;
defineCustomElement(_tagName, HelloWorld, { ..._elementOptions, observedAttributes: _observedAttrs });
//# sourceMappingURL=module.js.map