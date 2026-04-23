/**
 * Actions are functions that can be asynchronous and commit mutations.
 */
export type Action<S, P = any> = (
    context: { state: S, commit: (type: string, payload?: any) => void }, 
    payload: P
) => any;