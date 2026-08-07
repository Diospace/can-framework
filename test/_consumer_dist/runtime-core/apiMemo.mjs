export function memo(component, compareFn) {
    component.__isMemo = true;
    component.__memoCompare = compareFn;
    return component;
}
//# sourceMappingURL=apiMemo.mjs.map