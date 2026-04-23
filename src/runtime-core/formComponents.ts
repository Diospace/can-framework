import { defineCustomElement } from '../runtime-dom/customElement';
import { Component } from './Component';
import { createForm } from './form';

export class Form extends Component {
    private form: any;
     
    static get observedAttributes() {
        return ['id', 'action', 'method'];
    }

    render(): DocumentFragment {
        const templateStr = this.template.replace(/\${([\s\S]+?)}/g, (_: string, expr: string) => {
            const func = new Function('return ' + expr);
            return func.call(this);
        });
        return document.createRange().createContextualFragment(templateStr);
    }

    connectedCallback(): void {
        this.form = createForm({
            onSubmit: (values) => {
                this.dispatchEvent(new CustomEvent('submit', {
                    detail: values,
                    bubbles: true,
                    composed: true
                }));
            }
        });

        // Provide state to children (Dependency Injection)
        this.provide('form', this.form);
        super.connectedCallback();
        
        // Handle native form submission
        const form = this.shadowRoot?.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e :any) => {
                e.preventDefault();
                this.form.submit();
            });
        }
    }

    template = `
        <form>
            <slot></slot>
        </form>
        <style>
            :host { display: block; }
        </style>
    `;
}

export class FormInput extends Component {
    private form: any;

    static get observedAttributes() {
        return [
            'name', 'type', 'placeholder', 'label', 'value', 
            'required', 'pattern', 'minlength', 'maxlength',
            'msg-required', 'msg-pattern', 'msg-minlength', 'msg-maxlength',
            'async-validator'
        ];
    }

    render(): DocumentFragment {
        const templateStr = this.template.replace(/\${([\s\S]+?)}/g, (_: string, expr: string) => {
            const func = new Function('return ' + expr);
            return func.call(this);
        });
        return document.createRange().createContextualFragment(templateStr);
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.form = this.inject('form');
        
        if (this.form && this.props.name) {
            // Resolve async validator if a method name is provided via attribute
            const asyncMethodName = this.props['async-validator'];
            const asyncValidator = asyncMethodName && typeof (this as any)[asyncMethodName] === 'function'
                ? (this as any)[asyncMethodName].bind(this)
                : null;

            // Pass validation rules extracted from props to the form engine
            this.form.registerField(this.props.name, {
                required: this.props.required,
                pattern: this.props.pattern,
                minLength: this.props.minlength,
                maxLength: this.props.maxlength,
                messages: {
                    required: this.props['msg-required'],
                    pattern: this.props['msg-pattern'],
                    minLength: this.props['msg-minlength'],
                    maxLength: this.props['msg-maxlength']
                },
                asyncValidator
            });
        }

        const input = this.shadowRoot?.querySelector('input');
        if (input) {
            // Bind input changes to form state
            input.addEventListener('input', (e: any) => {
                if (this.form && this.props.name) {
                    this.form.setFieldValue(this.props.name, e.target.value);
                }
            });

            input.addEventListener('blur', () => {
                if (this.form && this.props.name) {
                    this.form.setFieldTouched(this.props.name);
                }
            });
        }
    }

    async checkUnique(value: string) {
        if (!value) return null;
        // Simulate an API request delay
        await new Promise(resolve => setTimeout(resolve, 800));
        if (value === 'admin@example.com') {
            return 'This email address is already taken.';
        }
        return null;
    }

    template = `
        <div class="field">
            <label>\${this.props.label || ''}<slot></slot></label>
            <input 
                type="\${this.props.type || 'text'}" 
                name="\${this.props.name || ''}" 
                placeholder="\${this.props.placeholder || ''}"
                value="\${this.props.value || ''}"
            />
            <div class="status-text">
                \${this.form?.state?.validating?.[this.props.name] ? 'Checking...' : ''}
                <span class="error">\${this.form?.state?.touched?.[this.props.name] ? (this.form?.state?.errors?.[this.props.name] || '') : ''}</span>
            </div>
        </div>
        <style>
            .field { margin-bottom: 1rem; }
            input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
            .status-text { font-size: 0.75rem; margin-top: 4px; min-height: 1.2em; color: #666; }
            .error { color: #d32f2f; }
            input:invalid { border-color: #d32f2f; }
        </style>
    `;
}

// Auto-register components
if (typeof customElements !== 'undefined') {
    if (!customElements.get('can-form')) defineCustomElement('can-form', Form as any);
    if (!customElements.get('can-input')) defineCustomElement('can-input', FormInput as any);
}