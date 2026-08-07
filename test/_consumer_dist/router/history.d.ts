export interface RouterHistory {
    push(path: string): void;
    replace(path: string): void;
    listen(cb: (path: string) => void): void;
    readonly location: string;
}
export declare function createWebHistory(): RouterHistory;
//# sourceMappingURL=history.d.ts.map