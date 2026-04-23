import { nextTick as coreNextTick } from '../runtime-core/scheduler';

export function nextTick(fn?: () => void): Promise<void> {
    return coreNextTick(fn);
}