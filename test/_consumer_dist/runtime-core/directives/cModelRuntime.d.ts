import { Directive } from './baseDirective';
/**
 * Functional wrapper for the compiler-generated code.
 */
export declare function cModel(el: HTMLElement, getter: () => any, setter: (val: any) => void, modifiers: any): void;
/**
 * Runtime logic for c-model.
 * Note: In your codegen, you call 'cModel()'. This Directive object
 * is the implementation used by the runtime renderer.
 */
export declare const cModelDirective: Directive;
//# sourceMappingURL=cModelRuntime.d.ts.map