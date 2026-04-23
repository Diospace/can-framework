import { describe, test, expect } from 'vitest';
import { createStore } from '../src/store/Store';

describe('Store', () => {
    test('should initialize with state', () => {
        const store = createStore({
            state: () => ({ count: 0 })
        });
        expect(store.state.value.count).toBe(0);
    });

    test('should commit mutations', () => {
        const store = createStore({
            state: () => ({ count: 0 }),
            mutations: {
                increment(state) {
                    state.count++;
                }
            }
        });

        store.commit('increment');
        expect(store.state.value.count).toBe(1);
    });

    test('should dispatch actions', () => {
        const store = createStore({
            state: () => ({ count: 0 }),
            mutations: {
                increment(state) {
                    state.count++;
                }
            },
            actions: {
                incrementAsync({ commit }) {
                    return new Promise<void>(resolve => {
                        commit('increment');
                        resolve();
                    });
                }
            }
        });

        return store.dispatch('incrementAsync').then(() => {
            expect(store.state.value.count).toBe(1);
        });
    });
});