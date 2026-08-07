import { Component } from './Component';
export declare function callWithErrorHandling(fn: Function, instance: Component | null, type: string, args?: any[]): any;
export declare function callWithAsyncErrorHandling(fn: Function | Function[], instance: Component | null, type: string, args?: any[]): any;
export declare function handleError(err: unknown, instance: Component | null, type: string): void;
//# sourceMappingURL=errorHandling.d.ts.map