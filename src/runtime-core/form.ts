import { reactive } from '../reactivity/index';

export function createForm(options: { onSubmit: (values: any) => void }) {
    const state = reactive({
        values: {} as Record<string, any>,
        errors: {} as Record<string, string>,
        touched: {} as Record<string, boolean>,
        validating: {} as Record<string, boolean>,
        isSubmitting: false
    });

    const fields: Record<string, any> = {};

    const validateField = async (name: string) => {
        const rules = fields[name];
        const value = state.values[name];
        let error = '';

        // 1. Sync Validation
        if (rules.required && !value) {
            error = rules.messages?.required || 'This field is required.';
        } else if (rules.minLength && String(value).length < rules.minLength) {
            error = rules.messages?.minLength || `Minimum length is ${rules.minLength}.`;
        } else if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
            error = rules.messages?.pattern || 'Invalid format.';
        }

        // 2. Async Validation
        if (!error && rules.asyncValidator) {
            state.validating[name] = true;
            try {
                const result = await rules.asyncValidator(value);
                if (typeof result === 'string') error = result;
            } catch (e) {
                error = 'Validation failed.';
            } finally {
                state.validating[name] = false;
            }
        }

        state.errors[name] = error;
        return !error;
    };

    return {
        state,
        registerField(name: string, rules: any = {}) {
            fields[name] = rules;
            state.values[name] = state.values[name] || '';
        },
        async setFieldValue(name: string, value: any) {
            state.values[name] = value;
            if (state.touched[name]) {
                await validateField(name);
            }
        },
        async setFieldTouched(name: string) {
            state.touched[name] = true;
            await validateField(name);
        },
        async submit() {
            state.isSubmitting = true;
            const names = Object.keys(fields);
            const results = await Promise.all(names.map(n => validateField(n)));
            
            if (results.every(r => r)) {
                options.onSubmit(state.values);
            }
            state.isSubmitting = false;
        }
    };
}