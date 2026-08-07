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
export declare function cValidate(el: HTMLElement, getter: () => ValidationRules): void;
//# sourceMappingURL=cValidateRuntime.d.ts.map