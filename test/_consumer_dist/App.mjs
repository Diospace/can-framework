import { Component, effect, createComponent, defineCustomElement } from './can-framework.mjs'; // Placeholder for build.ts to replace
import { HelloWorld } from './components/HelloWorld.mjs';
const _scopeId = 's57djg';
let _style = document.querySelector(`style[data-can-scope="${_scopeId}"]`);
if (!_style) {
    _style = document.createElement('style');
    _style.setAttribute('data-can-scope', _scopeId);
    document.head.appendChild(_style);
}
_style.textContent = `.container[data-v-s57djg] { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 10vh; }
.logo[data-v-s57djg] { width: 120px; height: 120px; transition: transform 0.3s ease; }
.logo:hover[data-v-s57djg] { transform: rotate(10deg) scale(1.1); }`;
const _kebabName = 'App'.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const _tagName = _kebabName.includes('-') ? _kebabName : 'can-' + _kebabName;
const _rawProps = [];
const _observedAttrs = _rawProps.map(p => p.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase());
const _baseClass = Component;
const _elementOptions = {};
export class App extends _baseClass {
    constructor() {
        super(...arguments);
        this.message = "Welcome to Can Framework";
    }
    static get observedAttributes() { return _observedAttrs; }
    static get defaultProps() { return {}; }
    static get propDefinitions() { return {}; }
    render() {
        const root = document.createDocumentFragment();
        const el0 = document.createElement("div");
        el0.setAttribute("class", "container");
        el0.setAttribute("data-v-s57djg", "");
        root.appendChild(el0);
        const el1 = document.createElement("img");
        el1.setAttribute("src", "/logo.svg");
        el1.setAttribute("alt", "Can Logo");
        el1.setAttribute("class", "logo");
        el1.setAttribute("data-v-s57djg", "");
        el0.appendChild(el1);
        const el2 = createComponent(HelloWorld, {});
        effect(() => el2.props["msg"] = `${this.message}`);
        effect(() => el2.props["data-v-s57djg"] = "");
        el0.appendChild(el2);
        return root;
    }
}
App.extends = null;
defineCustomElement(_tagName, App, { ..._elementOptions, observedAttributes: _observedAttrs });
//# sourceMappingURL=module.js.map