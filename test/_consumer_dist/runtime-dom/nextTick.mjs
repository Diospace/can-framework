import { nextTick as coreNextTick } from "../runtime-core/scheduler.mjs";
export function nextTick(fn) {
    return coreNextTick(fn);
}
//# sourceMappingURL=nextTick.mjs.map