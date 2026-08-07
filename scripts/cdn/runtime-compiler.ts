import { reactive, effect, computed, watch, isRef, unref, proxyRefs, EffectScope, traverse } from '../../src/reactivity';
import { cBind } from '../../src/runtime-core/directives/bind';
import { cOn } from '../../src/runtime-core/directives/on';
import { cIf } from '../../src/runtime-core/directives/if';
import { cFor } from '../../src/runtime-core/directives/list';
import { cRef } from '../../src/runtime-core/directives/Cref';
import { cShowDirective as cShow } from '../../src/runtime-core/directives/cShowRuntime';
import { cModel } from '../../src/runtime-core/directives/cModelRuntime';
import { cHtml } from '../../src/runtime-core/directives/html';
import { cValidate } from '../../src/runtime-core/directives/cValidateRuntime';
import { useTransition, cAnimate } from '../../src/runtime-core/animation';
import { LifecycleHooks, setCurrentInstance, onUnmounted } from '../../src/runtime-core/apiLifecycle';
import { t as translate } from '../../src/runtime-core/i18n';
import { nextTick } from '../../src/runtime-core/scheduler';
import { devtools, DevToolsEvents } from '../../src/devtools';
import { warn } from '../../src/shared';
import { Suspense } from '../../src/runtime-core/Suspense';
import { Teleport } from '../../src/runtime-core/Teleport';
import { inject } from '../../src/runtime-core/apiInject';
import { Form, FormInput } from '../../src/runtime-core/formComponents';
import { createForm } from '../../src/runtime-core/form';
import { parseAttributeValue } from '../../src/runtime-dom/attributeUtils';

/**
 * Global registry for components defined via createApp().component()
 */
const globalComponents = new Map<string, any>();

/**
 * Global registry for custom directives
 */
const globalDirectives = new Map<string, any>();

// Register built-in components by default
globalComponents.set('suspense', Suspense);
globalComponents.set('teleport', Teleport);

const GlobalHTMLElement = typeof globalThis.HTMLElement !== 'undefined' ? globalThis.HTMLElement : (class {} as any);

const kebabToCamel = (s: string) => s.replace(/-./g, x => x[1].toUpperCase());

/**
 * Registry of values provided by class-based components that are rendered into the
 * light DOM. Mirrors the provide/inject tree that normally lives on live custom
 * element instances (which are bypassed by the CDN light-DOM rendering path).
 */
const providesRegistry = new WeakMap<HTMLElement, Record<string, any>>();

function isClassComponent(def: any): boolean {
    return typeof def === 'function' &&
        def.prototype &&
        typeof def.prototype.render === 'function' &&
        (def.prototype instanceof GlobalHTMLElement);
}

function lookupProvide(el: HTMLElement, key: string, scope: any): any {
    let node: HTMLElement | null = el.parentElement;
    while (node) {
        const provides = providesRegistry.get(node);
        if (provides && key in provides) return provides[key];
        node = node.parentElement;
    }
    return scope?._context?.provides?.[key];
}

function wireClassComponentEvents(el: HTMLElement, comp: any) {
    if (comp instanceof Form) {
        const formEl = el.querySelector('form');
        if (formEl) {
            formEl.addEventListener('submit', (e: Event) => {
                e.preventDefault();
                // Keep native submit from bubbling up to @submit listeners on the host
                e.stopPropagation();
                comp.form.submit();
            });
        }
    } else if (comp instanceof FormInput) {
        const inputEl = el.querySelector('input');
        if (inputEl) {
            inputEl.addEventListener('input', (e: Event) => {
                if (comp.form && comp.props.name) {
                    comp.form.setFieldValue(comp.props.name, (e.target as HTMLInputElement).value);
                }
            });
            inputEl.addEventListener('blur', () => {
                if (comp.form && comp.props.name) {
                    comp.form.setFieldTouched(comp.props.name);
                }
            });
        }
    }
}

/**
 * Renders a class-based custom element (Form, FormInput, or any user class that
 * extends HTMLElement and implements render()) into the element's light DOM,
 * emulating the custom element lifecycle that shadow-DOM registration skips.
 */
function handleClassComponent(el: HTMLElement, compDef: any, scope: any, hydrating = false) {
    // 1. Instantiate the component
    const comp = new compDef();

    // 2. Sync observed attributes into the reactive props object
    const observed = compDef.observedAttributes || [];
    for (const attrName of observed) {
        if (el.hasAttribute(attrName)) {
            comp.props[kebabToCamel(attrName)] = parseAttributeValue(el.getAttribute(attrName));
        }
    }

    // 3. Wire up form-specific state (light-DOM replacement for connectedCallback)
    if (comp instanceof Form) {
        comp.form = createForm({
            onSubmit: (values: any) => {
                el.dispatchEvent(new CustomEvent('submit', { detail: values, bubbles: true, composed: true }));
            }
        });
        comp.provide('form', comp.form);
        providesRegistry.set(el, { form: comp.form });
    } else if (comp instanceof FormInput) {
        comp.form = lookupProvide(el, 'form', scope);
        if (comp.form && comp.props.name) {
            const asyncMethodName = comp.props['async-validator'] || comp.props.asyncValidator;
            const asyncValidator = asyncMethodName && typeof comp[asyncMethodName] === 'function'
                ? comp[asyncMethodName].bind(comp)
                : null;
            comp.form.registerField(comp.props.name, {
                required: comp.props.required,
                pattern: comp.props.pattern,
                minLength: comp.props.minlength,
                maxLength: comp.props.maxlength,
                messages: {
                    required: comp.props['msg-required'] || comp.props.msgRequired,
                    pattern: comp.props['msg-pattern'] || comp.props.msgPattern,
                    minLength: comp.props['msg-minlength'] || comp.props.msgMinLength,
                    maxLength: comp.props['msg-maxlength'] || comp.props.msgMaxLength
                },
                asyncValidator
            });
        }
    }

    // 4. Provide injection + interpolation context
    comp.inject = (key: string) => lookupProvide(el, key, scope);
    comp._context = scope._context || null;

    setCurrentInstance(comp);

    // 5. Render into the light DOM with reactive updates
    const originalChildren = Array.from(el.childNodes);
    const renderRunner = () => {
        el.innerHTML = '';
        const content = comp.render();
        if (content instanceof Node) {
            el.appendChild(content);
        }
        // Distribute original light-DOM children into the first <slot>
        if (originalChildren.length) {
            const slot = el.querySelector('slot');
            if (slot) originalChildren.forEach(child => slot.appendChild(child));
        }
        wireClassComponentEvents(el, comp);
    };

    comp._scope.run(() => {
        effect(renderRunner);
    });

    // 6. Apply the component's own directives (@submit, :prop, etc.)
    Array.from(el.attributes).forEach(({ name, value }) => {
        if (name.startsWith('c-') || name.startsWith(':') || name.startsWith('@')) {
            applyDirective(el, name, value, scope, hydrating);
        }
    });

    setCurrentInstance(null);

    // 7. Compile the rendered content
    comp._scope.run(() => {
        Array.from(el.childNodes).forEach(child => {
            compileDOM(child as HTMLElement, comp, hydrating);
        });
    });
}

/**
 * Framework primitive: <router-view> renders the matched route component
 * reactively, without requiring explicit component registration.
 */
function handleRouterView(el: HTMLElement, scope: any, hydrating = false) {
    const router = lookupProvide(el, 'router', scope);
    if (!router) {
        warn('[Router] <router-view> used without a router. Did you call app.use(router)?');
        return;
    }

    let viewScope: EffectScope | null = null;
    effect(() => {
        // Stop the previous view's effects before re-rendering
        viewScope?.stop();
        viewScope = new EffectScope();

        el.innerHTML = '';
        const match = router.currentRoute.value;

        if (match) {
            const container = document.createElement('div');
            container.style.display = 'contents';
            el.appendChild(container);

            viewScope.run(() => {
                const def = match.component;
                if (isClassComponent(def)) {
                    handleClassComponent(container, def, scope, hydrating);
                } else {
                    const template = typeof def === 'string' ? def : def?.template;
                    Object.keys(match.params || {}).forEach(key => {
                        container.setAttribute(key, match.params[key]);
                    });
                    container.innerHTML = template || '';
                    compileDOM(container, scope, hydrating);
                }
            });
        } else {
            el.textContent = '404 - Not Found';
        }
    });
}

/**
 * Framework primitive: <router-link> turns its content into a navigation anchor
 * and pushes the target route on click.
 */
function handleRouterLink(el: HTMLElement, scope: any) {
    const router = lookupProvide(el, 'router', scope);
    const to = el.getAttribute('to') || '/';

    const anchor = document.createElement('a');
    anchor.setAttribute('href', to);
    while (el.firstChild) anchor.appendChild(el.firstChild);
    el.appendChild(anchor);

    if (router) {
        el.addEventListener('click', (e: Event) => {
            e.preventDefault();
            router.push(to);
        });
    }
}

/**
 * Cache for compiled expressions to avoid the overhead of `new Function`
 */
const evalCache = new Map<string, Function>();

/**
 * Crawls the DOM and applies framework logic to elements.
 */
export function compileDOM(root: HTMLElement, scope: any, hydrating = false) {
    const walk = (node: Node) => {
        if (node.nodeType === 3) { // Text Node
            handleTextNode(node, scope);
        } else if (node.nodeType === 1) { // Element Node
            const el = node as HTMLElement;
            const continueWalking = handleElement(el, scope, hydrating);
            if (continueWalking) {
                let child = el.firstChild;
                while (child) {
                    walk(child);
                    child = child.nextSibling;
                }
            }
        }
    };
    walk(root);
}

function handleTextNode(node: Node, scope: any) {
    const originalText = node.textContent || '';
    const isOnce = (node.parentElement as HTMLElement)?.hasAttribute('c-once');

    const renderText = () => {
        const regex = scope._context?.delimitersRegex.value;
        if (!regex) return;

        regex.lastIndex = 0; // Reset global regex state
        if (regex.test(originalText)) {
            node.textContent = originalText.replace(regex, (_, exp) => String(unref(evaluate(exp.trim(), scope)) ?? ''));
        } else {
            node.textContent = originalText;
        }
    };

    if (isOnce) renderText();
    else effect(renderText);
}

export interface ComponentDefinition {
    name?: string;
    template?: string;
    setup?: (props: any) => object;
    data?: () => object;
    props?: string[] | Record<string, any>;
    methods?: Record<string, Function>;
    loader?: () => Promise<ComponentDefinition>;
    computed?: Record<string, () => any>;
    watch?: Record<string, (newVal: any, oldVal: any) => void>;
    beforeMount?: () => void;
    mounted?: () => void;
    updated?: () => void;
    unmounted?: () => void;
}

function handleElement(el: HTMLElement, scope: any, hydrating = false): boolean {
    // 1. Handle c-cloak: Remove immediately so content can show after initialization
    if (el.hasAttribute('c-cloak')) {
        el.removeAttribute('c-cloak');
    }

    // 2. Structural Directives (Highest Priority)
    if (el.hasAttribute('c-for')) {
        handleCFor(el, scope, hydrating);
        return false; 
    }

    if (el.hasAttribute('c-if')) {
        handleCIf(el, scope, hydrating);
        return false; 
    }

    // 3. Global Components (if registered)
    const tagName = el.tagName.toLowerCase();
    let compDef = globalComponents.get(tagName) as any;

    // Framework primitives: Router (no explicit registration required)
    if (tagName === 'router-view' && !compDef) {
        handleRouterView(el, scope, hydrating);
        return false;
    }
    if (tagName === 'router-link' && !compDef) {
        handleRouterLink(el, scope);
        return false;
    }

    if (compDef) {
        // Class-based custom elements are rendered into the light DOM with their
        // lifecycle emulated (connectedCallback / shadow DOM are not available here).
        if (isClassComponent(compDef)) {
            handleClassComponent(el, compDef, scope, hydrating);
            return false;
        }

        // Support for Class-based components (CanElement)
        // If the definition is a class, we resolve its template and props from an instance or prototype.
        let template = compDef.template;
        let propsConfig = compDef.props;

        if (!template && typeof compDef === 'function') {
            try {
                // Extract metadata from a temporary instance
                const tempInstance = new compDef();
                template = tempInstance.template || '';
                propsConfig = propsConfig || compDef.observedAttributes || tempInstance.constructor.observedAttributes;
                
                // Cache the resolved metadata back onto the definition to avoid re-instantiation in future walks
                compDef.template = template;
                compDef.props = propsConfig;
            } catch (e) {
                warn(`[Compiler] Failed to resolve template for class component: ${tagName}`);
            }
        }

        const compScope = new EffectScope();

        let state: any;

        // Setup mock instance for lifecycle/hook support
        const baseInstance: any = {
            $el: el,
            _context: scope._context || null,
            [LifecycleHooks.UNMOUNTED]: [],
            $refs: {},
            _scope: compScope
        };

        // Properly wrap instance with Proxy for local state and global properties fallback
        const compInstance = new Proxy(baseInstance, {
            get(target, key, receiver) {
                if (Reflect.has(target, key)) return Reflect.get(target, key, receiver);
                if (state && Reflect.has(state, key)) return Reflect.get(state, key, receiver);
                return (scope._context?.config.globalProperties as any)[key];
            },
            set(target, key, value, receiver) {
                if (Reflect.has(target, key)) return Reflect.set(target, key, value, receiver);
                if (state && Reflect.has(state, key)) {
                    return Reflect.set(state, key, value);
                }
                return Reflect.set(target, key, value, receiver);
            },
            has(target, key) {
                return Reflect.has(target, key) || 
                       (state && Reflect.has(state, key)) ||
                       (scope._context?.config.globalProperties as any)[key] !== undefined;
            }
        });
        
        setCurrentInstance(compInstance);

        // Support for Async Components via defineAsyncComponent/loader
        if (compDef.loader && typeof compDef.loader === 'function') {
            const suspense = inject<any>('SUSPENSE');
            suspense?.register();
            
            compDef.loader().then((resolvedDef: ComponentDefinition) => {
                // Cache resolved definition and re-compile this node
                globalComponents.set(tagName, resolvedDef);
                el.innerHTML = '';
                handleElement(el, scope);
                suspense?.resolve();
            }).catch((err: any) => {
                warn(`[Suspense] Failed to load async component: ${tagName}`, err);
                suspense?.resolve();
            });
            return false;
        }

        // 1. Resolve Props
        const props: Record<string, any> = {};
        if (propsConfig) {
            const observed = Array.isArray(propsConfig) ? propsConfig : Object.keys(propsConfig as any);
            observed.forEach((key: string) => {
                if (el.hasAttribute(key)) {
                    props[key] = el.getAttribute(key);
                } else if (!Array.isArray(propsConfig) && (propsConfig as any)[key]?.default !== undefined) {
                    props[key] = (propsConfig as any)[key].default;
                }
            });
        }

        const reactiveProps = reactive(props);

        // 2. Initialize Data and Setup
        const rawData = {
            ...reactiveProps,
            ...(compDef.data ? compDef.data.call(compInstance) : {}),
            ...(compDef.setup ? compDef.setup(reactiveProps) : {})
        };

        state = reactive(rawData);
        (baseInstance as any)._state = state; 

        compInstance.$emit = (event: string, detail?: any) => {
            el.dispatchEvent(new CustomEvent(event, { detail, bubbles: true, composed: true }));
        };
        compInstance.$nextTick = nextTick;

        // Bind methods
        if (compDef.methods) {
            for (const key in compDef.methods) {
                compInstance[key] = compDef.methods[key].bind(compInstance);
            }
        }

        // Setup Computed Properties
        if (compDef.computed) {
            for (const key in compDef.computed) {
                compScope.run(() => {
                    const c = computed(compDef.computed[key].bind(compInstance));
                    Object.defineProperty(compInstance, key, {
                        get: () => c.value,
                        enumerable: true
                    });
                });
            }
        }

        // Setup Watchers
        if (compDef.watch) {
            for (const key in compDef.watch) {
                const watchDef = compDef.watch[key];
                const handler = typeof watchDef === 'function' ? watchDef : watchDef.handler;
                const options = typeof watchDef === 'function' ? { deep: true } : watchDef;
                
                compScope.run(() => {
                    watch(() => compInstance[key], handler.bind(compInstance), options);
                });
            }
        }

        // Synchronize and Watch Attributes
        const syncAttrs = () => {
            Array.from(el.attributes).forEach(attr => {
                if (!attr.name.startsWith('c-') && !attr.name.startsWith(':') && !attr.name.startsWith('@')) {
                    compInstance[attr.name] = attr.value;
                }
            });
        };
        syncAttrs();

        const attrObserver = new MutationObserver(() => syncAttrs());
        attrObserver.observe(el, { attributes: true });
        
        // Ensure cleanup if component is removed
        compInstance[LifecycleHooks.UNMOUNTED].push(() => {
            attrObserver.disconnect();
            compScope.stop();
            if (compDef.unmounted) compDef.unmounted.call(compInstance);
        });

        // Optimized Scoped Styles: Only process and inject once per component type
        if (template.includes('<style')) {
            if (!compDef._processed) {
                const styleMatch = template.match(/<style(\s+scoped)?>([\s\S]*?)<\/style>/);
                if (styleMatch) {
                    const isScoped = !!styleMatch[1];
                    let css = styleMatch[2].trim();
                    compDef._rawTemplate = template.replace(styleMatch[0], '');
                    compDef._scopeId = isScoped ? Math.random().toString(36).substring(2, 9) : null;

                    if (compDef._scopeId) {
                        css = css.replace(/([^\r\n,{}]+)(?=[^{}]*{)/g, (selector: string) => 
                            selector.trim().split(',').map(s => `${s.trim()}[data-v-${compDef._scopeId}]`).join(', ')
                        );
                    }

                    const styleTag = document.createElement('style');
                    styleTag.textContent = css;
                    document.head.appendChild(styleTag);
                }
                compDef._processed = true;
            }
            template = compDef._rawTemplate || template;
            if (compDef._scopeId) el.setAttribute(`data-v-${compDef._scopeId}`, '');
        }

        // Save original light-dom children for distribution (e.g., inside Suspense)
        const originalChildren = Array.from(el.childNodes);
        el.innerHTML = template;
        // Re-append children so the component's internal slot logic can handle them
        originalChildren.forEach(child => el.appendChild(child));

        if (compDef.beforeMount) compDef.beforeMount.call(compInstance);
        setCurrentInstance(null);
        
        compScope.run(() => {
            // Compile only the children so the component element itself isn't
            // re-processed as a component (which would recurse infinitely).
            Array.from(el.childNodes).forEach(child => {
                compileDOM(child as HTMLElement, compInstance, hydrating);
            });
        });

        // Trigger mounted hook for the component
        compScope.run(() => {
            if (compDef.mounted) compDef.mounted.call(compInstance);
        });

        if (compDef.updated) {
            compScope.run(() => {
                effect(() => {
                    // Recursively track dependencies of the instance
                    traverse(compInstance); 
                    compDef.updated!.call(compInstance);
                });
            });
        }

        return false; // Component handles its own children, so don't walk its original children
    }

    // 3. Regular Attributes and Directives
    const attrs = Array.from(el.attributes);
    for (const { name, value } of attrs) {
        if (name.startsWith('c-') || name.startsWith(':') || name.startsWith('@')) {
            applyDirective(el, name, value, scope, hydrating);
        }
    }

    return true;
}

function handleCIf(el: HTMLElement, scope: any, hydrating = false) {
    const exp = el.getAttribute('c-if')!;
    const transitionName = el.getAttribute('animate') || el.className.match(/animate-(\w+)/)?.[1];
    
    el.removeAttribute('c-if');
    el.removeAttribute('animate');

    const parent = el.parentElement!;
    const condition = { get value() { return !!evaluate(exp, scope); }, __c_isRef: true }; // Mark as ref for cIf
    
    let hydrationNode: HTMLElement | undefined = hydrating ? el : undefined;

    cIf(parent, condition, () => {
        if (hydrationNode) {
            const target = hydrationNode;
            hydrationNode = undefined; // Use only once
            compileDOM(target, scope, hydrating);
            return target;
        }
        const clone = el.cloneNode(true) as HTMLElement;
        if (transitionName) {
            const transition = useTransition(clone, transitionName);
            // We need to wait for the next tick to ensure the element is in the DOM 
            // before starting the enter transition
            nextTick(() => transition.enter());
            
            // Patch the remove child logic to handle leave transitions
            const originalRemove = clone.remove;
            clone.remove = async () => {
                await transition.leave();
                originalRemove.call(clone);
            };
        }

        compileDOM(clone, scope, false);
        return clone;
    });
    
    if (!hydrating) el.remove();
}

function handleCFor(el: HTMLElement, scope: any, hydrating = false) {
    const exp = el.getAttribute('c-for')!;
    el.removeAttribute('c-for');
    const [alias, sourceExp] = exp.split(' in ').map(s => s.trim());
    const parent = el.parentElement!;
    const listSource = { get value() { return evaluate(sourceExp, scope); }, __c_isRef: true }; // Mark as ref for cFor

    cFor(parent, listSource, (item, index) => {
        // Create a nested scope for the loop iteration
        const childScope = Object.create(scope);
        childScope[alias] = item;
        childScope.index = index;

        const clone = el.cloneNode(true) as HTMLElement;
        compileDOM(clone, childScope, false); // Items generated after initial load aren't hydrated
        return clone;
    });
    if (!hydrating) el.remove();
}

function applyDirective(el: HTMLElement, name: string, exp: string, scope: any, hydrating = false) {
    // Shorthand expansion
    const directive = name.startsWith(':') ? `c-bind${name}` : 
                     name.startsWith('@') ? `c-on:${name.slice(1)}` : name;

    if (directive.startsWith('c-bind:')) {
        const [attr, ...modifiers] = directive.split(':').pop()!.split('.');
        const modifierObj = modifiers.reduce((acc, m) => ({ ...acc, [m]: true }), {});
        cBind(el, attr, () => evaluate(exp, scope), modifierObj);
    } 
    else if (directive.startsWith('c-on:')) {
        const [eventName, ...modifiers] = directive.slice(5).split('.');
        
        // Advanced event binding: handle both method names and inline statements with $event
        cOn(el, eventName, (e: Event) => {
            // Pass $event into the local evaluation context
            const handler = evaluate(exp, scope, { $event: e });
            
            // If expression returned a function (e.g., @click="increment"), 
            // we call it. If it was a statement (e.g., @click="count++"), evaluate already ran it.
            if (typeof handler === 'function') {
                // Custom events carry their payload in `detail` (Vue-style $emit convention)
                const payload = e instanceof CustomEvent && e.detail !== undefined ? e.detail : e;
                handler.call(scope, payload);
            }
            // If it was an inline statement (like count++), evaluate handled the execution
            // and we don't need to do anything further.
        }, modifiers);
    }
    else if (directive === 'c-show') {
        const transitionName = directive.split('.')[1];
        // Wrap in a ref-like object so the directive's internal effect stays reactive
        const bindingValue = { get value() { return evaluate(exp, scope); }, __c_isRef: true };
        
        if (transitionName) {
            const transition = useTransition(el, transitionName);
            effect(() => {
                const val = unref(evaluate(exp, scope));
                if (val) transition.enter();
                else transition.leave();
            });
        } else {
            cShow.mounted?.(el, { value: bindingValue, modifiers: {}, instance: null });
        }
    }
    else if (directive === 'c-once') {
        // c-once is handled in handleTextNode and attribute evaluation logic
        // but we remove it here to clean up the DOM
        el.removeAttribute('c-once');
    }
    else if (directive.startsWith('c-model')) {
        const parts = exp.split('.');
        let target = scope;
        for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]];
            if (!target) break;
        }
        const key = parts[parts.length - 1];
        if (target) {
            const modifiers = directive.split('.').slice(1).reduce((acc, m) => ({ ...acc, [m]: true }), {});
            cModel(el, () => target[key], (v) => { target[key] = v; }, modifiers);
        }
    } else if (directive === 'c-html') {
        cHtml(el, () => evaluate(exp, scope));
    } else if (directive === 'c-text') {
        effect(() => {
            el.textContent = String(evaluate(exp, scope));
        });
    } else if (directive === 'c-ref') {
        // Vue-like $refs support: store the element in the instance's $refs object
        if (scope.$refs) scope.$refs[exp.trim()] = el;
    } else if (directive === 'c-validate') {
        cValidate(el, () => evaluate(exp, scope));
    } else if (directive === 'c-portal' || directive === 'c-teleport' || name === 'to') {
        const targetSelector = evaluate(exp, scope);
        const target = document.querySelector(targetSelector);
        if (target) {
            target.appendChild(el);
        }
    } else if (globalDirectives.has(directive)) {
        const dir = globalDirectives.get(directive);
        const modifiers = name.split('.').slice(1).reduce((acc, m) => ({ ...acc, [m]: true }), {});
        dir.mounted?.(el, { value: evaluate(exp, scope), modifiers, instance: scope, arg: name.split(':')[1] });
    } else if (name === 't') {
        // Handle i18n t attribute
        effect(() => {
            el.textContent = translate(exp);
        });
    } else if (directive === 'c-animate') {
        // Use the full animation engine from animation.ts
        effect(() => {
            cAnimate(el, evaluate(exp, scope));
        });
    } else if (directive.startsWith('animate:')) {
        const transitionName = directive.includes(':') ? directive.split(':')[1] : 'fade';
        const transition = useTransition(el, transitionName);
        effect(() => { 
            const shouldShow = !!unref(evaluate(exp, scope));
            if (shouldShow) transition.enter(); 
            else transition.leave(); 
        });
    }
}

/**
 * Safely evaluates a JS expression against a specific reactive scope.
 * Uses `new Function` for dynamic evaluation, which is common in runtime compilers.
 * Be mindful of Content Security Policy (CSP) if this is used in a strict environment.
 */
function evaluate(exp: string, scope: any, locals: Record<string, any> = {}) {
    try {
        const trimmedExp = exp.trim();
        // 1. Check for Optimized (Pre-compiled) Expressions
        const optimized = scope._context?.config.expressions?.[trimmedExp];
        if (optimized && Object.keys(locals).length === 0) {
            return unref(optimized(scope));
        }

        // Cache key includes whether locals exist to prevent collisions
        const cacheKey = (Object.keys(locals).length > 0 ? 'L:' : 'S:') + exp;
        let fn = evalCache.get(cacheKey);

        if (!fn) {
            // We use two 'with' blocks. The first (locals) takes precedence over the second (scope).
            // This allows $event to override any 'count' property in the state if they share a name.
            fn = new Function('scope', 'locals', `
                with(scope) { 
                    with(locals) {
                        try { return ${exp}; } catch(e) { return ''; } 
                    }
                }
            `);
            evalCache.set(cacheKey, fn);
        }

        return unref(fn(scope, locals));
    } catch (e) {
        warn(`Failed to evaluate expression: "${exp}"`, e);
        return '';
    }
}

/**
 * Public API for the CDN build.
 * Supports setup(), data(), methods, computed, watch, mounted lifecycle, and global component registration.
 */
export function createApp(options: { 
    setup?: (props: any) => object, 
    data?: () => object,
    props?: string[] | Record<string, any>,
    methods?: Record<string, Function>,
    computed?: Record<string, () => any>,
    watch?: Record<string, (newVal: any, oldVal: any) => void>,
    beforeMount?: () => void,
    mounted?: () => void,
    updated?: () => void,
    unmounted?: () => void,
    filter?: () => void,
    template?: string,
    store?: any
}) { // Add ComponentDefinition to App interface
    const context = {
        provides: Object.create(null),
        config: reactive({
            errorHandler: null,
            warnHandler: null,
            globalProperties: {} as Record<string, any>,
            delimiters: (options as any).delimiters || ['{{', '}}'],
            expressions: (options as any).expressions || {} // Pre-compiled map
        })
    };

    // Pre-compute the delimiter regex reactively
    const delimitersRegex = computed(() => {
        const [open, close] = context.config.delimiters;
        const o = open.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const c = close.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`${o}(.*?)${c}`, 'g');
    });

    return {
        /**
         * Register a global component for use in templates.
         */
        component(name: string, definition: ComponentDefinition | any) {
            globalComponents.set(name.toLowerCase(), definition);
            return this; // Allow chaining
        },

        /**
         * Register a global directive.
         */
        directive(name: string, definition: any) {
            globalDirectives.set(`c-${name}`, definition);
            return this;
        },

        /**
         * Provide a value globally.
         */
        provide(key: string, value: any) {
            context.provides[key] = value;
            return this;
        },

        /**
         * Set custom delimiters for interpolation.
         */
        setDelimiters(open: string, close: string) {
            context.config.delimiters = [open, close];
            return this;
        },

        /**
         * Install a plugin (Router, Store, etc.)
         */
        use(plugin: any, ...options: any[]) {
            if (plugin && typeof plugin.install === 'function') {
                plugin.install(this, ...options);
            } else if (typeof plugin === 'function') {
                plugin(this, ...options);
            }
            return this;
        },

        /**
         * Hydrate the application from server-rendered HTML.
         */
        hydrate(selector: string | HTMLElement) {
            const root = typeof selector === 'string' 
                ? document.querySelector(selector) as HTMLElement 
                : selector;
            if (!root) return warn(`Hydration target ${selector} not found.`);
            
            const { instance } = this._init(root, true);
            compileDOM(root, instance, true);
            if (options.mounted) options.mounted.call(instance);
            return instance;
        },

        /**
         * Mount the application to a DOM element.
         * Initializes state, binds methods, and starts the DOM compiler.
         */
        mount(selector: string | HTMLElement) {
            const root = typeof selector === 'string' 
                ? document.querySelector(selector) as HTMLElement 
                : selector;
            if (!root) {
                warn(`Mount target ${selector} not found.`);
                return;
            }
            const { instance } = this._init(root, false);
            compileDOM(root, instance, false);
            if (options.mounted) options.mounted.call(instance);
            return instance;
        },

        _init(root: HTMLElement, hydrating = false) {
            // Internal helper to share initialization logic between mount and hydrate

            // If a template is provided in options, inject it into the root
            if (!hydrating && (options as any).template) {
                root.innerHTML = (options as any).template;
            }

            // Initialize a mock instance for lifecycle support
            const instance: any = {
                _context: context,
                $el: root,
                $emit: (event: string, detail?: any) => {
                    root.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }));
                },
                $nextTick: nextTick,
                $refs: {}, // Initialize refs storage for root
                [LifecycleHooks.UNMOUNTED]: [],
            };

            // Add delimsRegex to context for handleTextNode
            (context as any).delimitersRegex = delimitersRegex;

            // 1. Resolve props for the root component from attributes on the mount target
            const props = {};
            if (options.props) {
                const observed = Array.isArray(options.props) ? options.props : Object.keys(options.props as any);
                observed.forEach((key: string) => {
                    if (root.hasAttribute(key)) {
                        (props as any)[key] = root.getAttribute(key);
                    } else if (!Array.isArray(options.props) && (options.props as any)[key]?.default !== undefined) {
                        (props as any)[key] = (options.props as any)[key].default;
                    }
                });
            }

            const reactiveProps = reactive(props);

            const rawData = {
                ...reactiveProps,
                ...(options.data ? options.data.call(instance) : {}), 
                ...(options.setup ? options.setup(reactiveProps) : {}),
                $store: options.store, // Make store accessible via $store
               
            };

            // Set active instance so reactive() and other setup logic can see it
            setCurrentInstance(instance);

            // Merge reactive state into instance
            const state = reactive(rawData);
            
            // Use a Proxy for the instance to support reactive globalProperties
            const proxyInstance = new Proxy(instance, {
                get(target, key, receiver) {
                    if (Reflect.has(target, key)) return Reflect.get(target, key, receiver);
                    if (Reflect.has(state, key)) return Reflect.get(state, key, receiver);
                    return (context.config.globalProperties as any)[key];
                },
                set(target, key, value, receiver) {
                    if (Reflect.has(target, key)) return Reflect.set(target, key, value, receiver);
                    if (Reflect.has(state, key)) {
                        return Reflect.set(state, key, value);
                    }
                    return Reflect.set(target, key, value, receiver);
                },
                has(target, key) {
                    return Reflect.has(target, key) || 
                           Reflect.has(state, key) || 
                           (context.config.globalProperties as any)[key] !== undefined;
                }
            });

            // DevTools initialization
            devtools.emit(DevToolsEvents.COMPONENT_MOUNT, proxyInstance);

            // Shared provides/inject context (parity with apiInject.ts)
            proxyInstance._context = context;

            if (options.store) options.store.install?.({ provide: (k: string, v: any) => (state as any)[k] = v });

            // 2. Bind Methods
            if (options.methods) {
                for (const key in options.methods) {
                    instance[key] = options.methods[key].bind(proxyInstance);
                }
            }

            // 3. Setup Computed Properties
            if (options.computed) {
                for (const key in options.computed) {
                    const c = computed(options.computed[key].bind(proxyInstance));
                    Object.defineProperty(instance, key, {
                        get: () => c.value,
                        enumerable: true
                    });
                }
            }

            // 4. Setup Watchers
            if (options.watch) {
                for (const key in options.watch) {
                    const watchDef = options.watch[key];
                    const handler = typeof watchDef === 'function' ? watchDef : (watchDef as any).handler;
                    const watchOptions = typeof watchDef === 'function' ? { deep: true } : watchDef;
                    watch(() => proxyInstance[key], handler.bind(proxyInstance), watchOptions);
                }
            }

            // 5. Lifecycle Registration
            if (options.beforeMount) options.beforeMount.call(proxyInstance);

            if (options.updated) {
                effect(() => {
                    // Force the effect to track all reactive properties in the state
                    traverse(state);
                    options.updated!.call(proxyInstance);
                });
            }

            return {
                instance: proxyInstance,
                unmount: () => {
                    if (instance[LifecycleHooks.UNMOUNTED]) {
                        instance[LifecycleHooks.UNMOUNTED].forEach((fn: Function) => fn());
                    }
                    root.innerHTML = '';
                    devtools.emit(DevToolsEvents.COMPONENT_UNMOUNT, instance);
                }
            };
        }
    };
}
