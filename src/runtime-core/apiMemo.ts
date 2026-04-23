export function memo(component: any, compareFn?: (prev: any, next: any) => boolean) {
    component.__isMemo = true;
    component.__memoCompare = compareFn;
    return component;
}