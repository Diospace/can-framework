import { effect } from '../../reactivity/index';
import { unref } from '../../reactivity/ref';

export interface ValidationRules {
    value: any;
    required?: boolean | string;
    min?: number;
    email?: boolean;
    custom?: (val: any) => string | null;
}

/**
 * Runtime helper for c-validate.
 * Creates an error message element and tracks validation state.
 */
export function cValidate(el: HTMLElement, getter: () => ValidationRules) {
    // 1. Create the error display element
    const errorEl = document.createElement('span');
    errorEl.className = 'can-error-msg';
    errorEl.style.color = '#d93025';
    errorEl.style.fontSize = '0.8rem';
    errorEl.style.marginTop = '4px';
    errorEl.style.display = 'none';
    
    // Insert after the input
    el.after(errorEl);

    effect(() => {
        const rules = getter();
        const val = unref(rules.value);
        const error = runValidation(val, rules);

        if (error) {
            errorEl.textContent = error;
            errorEl.style.display = 'block';
            el.style.borderColor = '#d93025';
        } else {
            errorEl.style.display = 'none';
            el.style.borderColor = '';
        }
    });
}

function runValidation(val: any, rules: ValidationRules): string | null {
    if (rules.required && !val) {
        return typeof rules.required === 'string' ? rules.required : 'This field is required';
    }
    
    if (rules.min && String(val).length < rules.min) {
        return `Minimum length is ${rules.min} characters`;
    }

    if (rules.email && val && !/^\S+@\S+\.\S+$/.test(String(val))) {
        return 'Please enter a valid email address';
    }

    if (rules.custom) return rules.custom(val);

    return null;
}