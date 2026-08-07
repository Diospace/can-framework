export declare function queueJob(job: Function): void;
export declare function queuePostFlushJob(job: Function): void;
/**
 * Returns true if the scheduler is currently executing the flush cycle.
 * Used for optimizations to skip redundant validations during DOM updates.
 */
export declare function isFlushing(): boolean;
/**
 * Returns a promise that resolves after the current scheduler flush cycle.
 * If no flush is pending, it resolves in the next microtask.
 */
export declare function nextTick(fn?: () => void): Promise<void>;
//# sourceMappingURL=scheduler.d.ts.map