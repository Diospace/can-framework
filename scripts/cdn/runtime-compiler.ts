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
import { LifecycleHooks, setCurrentInstance } from '../../src/runtime-core/apiLifecycle';
import { t as translate } from '../../src/runtime-core/i18n';
import { nextTick } from '../../src/runtime-core/scheduler';
import { devtools, DevToolsEvents } from '../../src/devtools';
import { warn } from '../../src/shared';


/**
 * Global registry for components defined via createApp().component()
 */
const globalComponents = new Map<string, any>();

/**
 * Global registry for custom directives
 */
const globalDirectives = new Map<string, any>();

/**
 * Cache for compiled expressions to avoid the overhead of `new Function`
 */
const evalCache = new Map<string, Function>();

/**
 * Crawls the DOM and applies framework logic to elements.
 */
export function compileDOM(root: HTMLElement, scope: any) {
    const walk = (node: Node) => {
        if (node.nodeType === 3) { // Text Node
            handleTextNode(node, scope);
        } else if (node.nodeType === 1) { // Element Node
            const el = node as HTMLElement;
            const continueWalking = handleElement(el, scope);
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
    template: string;
    setup?: (props: any) => object;
    data?: () => object;
    props?: string[] | Record<string, any>;
    methods?: Record<string, Function>;
    computed?: Record<string, () => any>;
    watch?: Record<string, (newVal: any, oldVal: any) => void>;
    beforeMount?: () => void;
    mounted?: () => void;
    updated?: () => void;
    unmounted?: () => void;
}

function handleElement(el: HTMLElement, scope: any): boolean {
    // 1. Handle c-cloak: Remove immediately so content can show after initialization
    if (el.hasAttribute('c-cloak')) {
        el.removeAttribute('c-cloak');
    }

    // 2. Structural Directives (Highest Priority)
    // These modify the DOM tree, so we stop standard walking if they are present.
    if (el.hasAttribute('c-for')) {
        handleCFor(el, scope);
        return false; // Stop walking; cFor handles its own children
    }

    if (el.hasAttribute('c-if')) {
        handleCIf(el, scope);
        return false; // Stop walking; cIf handles its own children
    }

    // 3. Global Components (if registered)
    const tagName = el.tagName.toLowerCase();
    if (globalComponents.has(tagName)) {
        const compDef = globalComponents.get(tagName)!;
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

        // 1. Resolve Props
        const props: Record<string, any> = {};
        if (compDef.props) {
            const observed = Array.isArray(compDef.props) ? compDef.props : Object.keys(compDef.props as any);
            observed.forEach((key: string) => {
                if (el.hasAttribute(key)) {
                    props[key] = el.getAttribute(key);
                } else if (!Array.isArray(compDef.props) && (compDef.props as any)[key]?.default !== undefined) {
                    props[key] = (compDef.props as any)[key].default;
                }
            });
        }

        // 2. Initialize Data and Setup
        const rawData = {
            ...props,
            ...(compDef.data ? compDef.data.call(compInstance) : {}),
            ...(compDef.setup ? compDef.setup(props) : {})
        };

        state = reactive(rawData);
        // Note: The Proxy 'compInstance' already handles delegation to 'state' 
        // via the get/set traps implemented below. We just need to store 'state' 
        // in the closure or on the base instance.
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

        // Compile the component's template into the current element
        let template = compDef.template;

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

        el.innerHTML = template;

        if (compDef.beforeMount) compDef.beforeMount.call(compInstance);
        setCurrentInstance(null);
        
        compScope.run(() => {
            compileDOM(el, compInstance); // Recursively compile with component's scope
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
            applyDirective(el, name, value, scope);
        }
    }

    return true;
}

function handleCIf(el: HTMLElement, scope: any) {
    const exp = el.getAttribute('c-if')!;
    const transitionName = el.getAttribute('animate') || el.className.match(/animate-(\w+)/)?.[1];
    
    el.removeAttribute('c-if');
    el.removeAttribute('animate');

    const parent = el.parentElement!;
    // Wrap evaluation in a signal-like interface for the cIf helper
    const condition = { get value() { return !!evaluate(exp, scope); }, __c_isRef: true }; // Mark as ref for cIf
    
    cIf(parent, condition, () => {
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

        compileDOM(clone, scope);
        return clone;
    });
    el.remove();
}

function handleCFor(el: HTMLElement, scope: any) {
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
        compileDOM(clone, childScope);
        return clone;
    });
    el.remove();
}

function applyDirective(el: HTMLElement, name: string, exp: string, scope: any) {
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
                handler.call(scope, e);
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
    store?: any
}) { // Add ComponentDefinition to App interface
    const context = {
        provides: Object.create(null),
        config: reactive({
            errorHandler: null,
            warnHandler: null,
            globalProperties: {} as Record<string, any>,
            delimiters: (options as any).delimiters || ['{{', '}}']
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
        component(name: string, definition: ComponentDefinition) {
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
         * Mount the application to a DOM element.
         * Initializes state, binds methods, and starts the DOM compiler.
         */
        mount(selector: string) {
            const root = document.querySelector(selector) as HTMLElement;
            if (!root) {
                warn(`Mount target ${selector} not found.`);
                return;
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

            // Set active instance so composables like useFetch can register cleanup hooks
            setCurrentInstance(instance);

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

            const rawData = {
                ...props,
                ...(options.data ? options.data.call(instance) : {}), 
                ...(options.setup ? options.setup(props) : {}),
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

            // 5. Compile DOM against the processed instance
            setCurrentInstance(proxyInstance);
            compileDOM(root, proxyInstance);
            setCurrentInstance(null);

            // 6. Trigger Lifecycle
            if (options.mounted) options.mounted.call(proxyInstance);
            
            if (options.updated) {
                effect(() => {
                    // Force the effect to track all reactive properties in the state
                    traverse(state);
                    options.updated!.call(proxyInstance);
                });
            }

            console.log('[Can] Application successfully mounted.');
            
            return {
                instance,
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
