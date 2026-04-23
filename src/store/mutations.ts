/**
 * Mutations are synchronous functions that mutate the state directly.
 */
export type Mutation<S, P = any> = (state: S, payload: P) => void;