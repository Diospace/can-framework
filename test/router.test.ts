import { describe, test, expect, beforeEach, vi } from 'vitest';
// Mock browser environment for Node.js testing
const mockPushState = vi.fn();
const mockReplaceState = vi.fn();

Object.defineProperty(global, 'window', {
    value: {
        location: { pathname: '/' },
        history: {
            pushState: mockPushState,
            replaceState: mockReplaceState
        },
        addEventListener: vi.fn()
    },
    writable: true
});

import { Router } from '../src/router/Router';

describe('Router', () => {
    beforeEach(() => {
        mockPushState.mockClear();
        (window.location as any).pathname = '/';
    });

    test('should resolve initial route', () => {
        const routes = [{ path: '/', component: 'home-page' }];
        const router = new Router(routes);
        expect(router.matchedComponent).toBe('home-page');
    });

    test('should navigate and update signal', () => {
        const routes = [{ path: '/about', component: 'about-page' }];
        const router = new Router(routes);

        router.push('/about');
        expect(router.currentRoute.value).toBe('/about');
        expect(mockPushState).toHaveBeenCalled();
    });
});