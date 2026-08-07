export declare function createForm(options: {
    onSubmit: (values: any) => void;
}): {
    state: {
        values: Record<string, any>;
        errors: Record<string, string>;
        touched: Record<string, boolean>;
        validating: Record<string, boolean>;
        isSubmitting: boolean;
    };
    registerField(name: string, rules?: any): void;
    setFieldValue(name: string, value: any): Promise<void>;
    setFieldTouched(name: string): Promise<void>;
    submit(): Promise<void>;
};
//# sourceMappingURL=form.d.ts.map