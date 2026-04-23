export interface DirectiveBinding<T = any> {
    value: T;
    oldValue?: T;
    arg?: string;
    modifiers: Record<string, boolean>;
    instance: any;
}

export interface Directive<T = any> {
    beforeMount?: (el: HTMLElement, binding: DirectiveBinding<T>) => void;
    mounted?: (el: HTMLElement, binding: DirectiveBinding<T>) => void;
    beforeUpdate?: (el: HTMLElement, binding: DirectiveBinding<T>) => void;
    updated?: (el: HTMLElement, binding: DirectiveBinding<T>) => void;
    beforeUnmount?: (el: HTMLElement, binding: DirectiveBinding<T>) => void;
    unmounted?: (el: HTMLElement, binding: DirectiveBinding<T>) => void;
}