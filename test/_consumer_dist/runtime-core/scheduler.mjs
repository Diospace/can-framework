const queue = new Set();
const postFlushQueue = new Set();
let isBatching = false;
let flushing = false;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
export function queueJob(job) {
    queue.add(job);
    queueFlush();
}
export function queuePostFlushJob(job) {
    postFlushQueue.add(job);
    queueFlush();
}
/**
 * Returns true if the scheduler is currently executing the flush cycle.
 * Used for optimizations to skip redundant validations during DOM updates.
 */
export function isFlushing() {
    return flushing;
}
function queueFlush() {
    if (!isBatching) {
        isBatching = true;
        currentFlushPromise = resolvedPromise.then(flushJobs);
    }
}
function flushJobs() {
    isBatching = false;
    flushing = true;
    try {
        // 1. Run standard (pre-flush) jobs
        queue.forEach(job => job());
        queue.clear();
        // 2. Run post-flush jobs (e.g., watch with flush: 'post')
        postFlushQueue.forEach(job => job());
        postFlushQueue.clear();
    }
    finally {
        // Ensure the promise is cleared so the next batch can start fresh
        flushing = false;
        currentFlushPromise = null;
    }
}
/**
 * Returns a promise that resolves after the current scheduler flush cycle.
 * If no flush is pending, it resolves in the next microtask.
 */
export function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(fn) : p;
}
//# sourceMappingURL=scheduler.mjs.map