import { EffectScope } from '../reactivity/index';
declare const GlobalHTMLElement: any;
/**
 * Maps native tag names to their corresponding constructor classes.
 */
export declare const nativeElementMap: Record<string, any>;
export declare class CanElement extends GlobalHTMLElement {
    constructor();
    props: any;
    protected _scope: EffectScope;
    private _isMounted;
    private _renderEffect;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    private _validateProp;
    connectedCallback(): void;
    disconnectedCallback(): void;
    adoptedCallback(): void;
    focus(options?: FocusOptions): void;
    /**
     * Renders the component. Override this method to implement custom rendering logic.
     */
    render(): void;
    /**
     * Dispatches a custom event.
     * @param name The name of the event.
     * @param detail The data to pass with the event.
     * @param options Additional event options.
     */
    emit(name: string, detail?: any, options?: CustomEventInit): void;
}
export declare function defineCustomElement(name: string, component: CustomElementConstructor, // The actual component class
options?: ElementDefinitionOptions & {
    observedAttributes?: string[];
}): void;
export {};
//# sourceMappingURL=customElement.d.ts.map