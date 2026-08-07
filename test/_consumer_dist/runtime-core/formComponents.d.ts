import { Component } from './Component';
export declare class Form extends Component {
    private form;
    static get observedAttributes(): string[];
    render(): DocumentFragment;
    connectedCallback(): void;
    template: string;
}
export declare class FormInput extends Component {
    private form;
    static get observedAttributes(): string[];
    render(): DocumentFragment;
    connectedCallback(): void;
    checkUnique(value: string): Promise<"This email address is already taken." | null>;
    template: string;
}
//# sourceMappingURL=formComponents.d.ts.map