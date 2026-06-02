import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Router } from '../src/router/Router';
import { nextTick } from '../src/runtime-dom/nextTick';

describe('Router', () => {
    beforeEach(() => {
        // Reset history state for each test using the real Happy DOM API
        window.history.pushState({}, '', '/');
    });

    test('should resolve initial route', () => {
        const routes = [{ path: '/', component: 'home-page' }];
        const router = new Router({ routes });
        expect(router.currentRoute.value?.component).toBe('home-page');
    });

    test('should navigate and update signal', async () => {
        const routes = [{ path: '/about', component: 'about-page' }];
        const router = new Router({ routes });
        
        const pushSpy = vi.spyOn(window.history, 'pushState'); // Spy on the actual history method
        
        router.push('/about');
        
        await nextTick(); // Wait for potential reactive updates
        expect(router.currentRoute.value?.path).toBe('/about');
        expect(pushSpy).toHaveBeenCalled();
    });
});