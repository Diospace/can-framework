export declare function provide(key: string, value: any): void;
export declare function inject<T = any>(key: string, defaultValue?: T): T | undefined;
export declare function createContext<T>(key: string, defaultValue?: T): {
    provide(value: T): void;
    use(): T | undefined;
};
//# sourceMappingURL=apiInject.d.ts.map