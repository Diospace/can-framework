import { describe, it, expect, vi } from 'vitest';
import { createRouter } from '../src/router/index';
import { createApp } from '../scripts/cdn/runtime-compiler';
import { Form, FormInput } from '../src/runtime-core/formComponents';
import { nextTick } from '../src/runtime-dom/nextTick';

describe('Router Integration', () => {
    it('should navigate between routes', async () => {
        const Home = { template: '<div>Home Page</div>' };
        const About = { template: '<div>About Page</div>' };
        
        const router = createRouter({
            routes: [
                { path: '/', component: Home as any },
                { path: '/about', component: About as any }
            ]
        });

        const app = createApp({
            template: `
                <router-link to="/about" id="nav-btn">About</router-link>
                <router-view></router-view>
            `
        });
        app.use(router);
        
        const root = document.createElement('div');
        app.mount(root);

        expect(root.innerHTML).toContain('Home Page');
        
        const link = root.querySelector('#nav-btn') as HTMLElement;
        link.click();
        
        await nextTick();
        expect(root.innerHTML).toContain('About Page');
        expect(window.location.pathname).toBe('/about');
    });
});

describe('Form Integration', () => {
    it('should handle validation and submission', async () => {
        const onSubmit = vi.fn();
        
        const app = createApp({
            setup() {
                return { onSubmit };
            },
            template: `
                <can-form @submit="onSubmit">
                    <can-input name="username" required label="User" id="u-input"></can-input>
                    <button type="submit" id="submit-btn">Send</button>
                </can-form>
            `
        });
        app.component('can-form', Form);
        app.component('can-input', FormInput);

        const root = document.createElement('div');
        app.mount(root);
        
        const input = root.querySelector('input') as HTMLInputElement;
        const form = root.querySelector('form') as HTMLFormElement;

        // Test Validation
        form.dispatchEvent(new Event('submit'));
        await nextTick();
        expect(onSubmit).not.toHaveBeenCalled();
        expect(root.innerHTML).toContain('required');

        // Test Valid Submission
        input.value = 'CanDeveloper';
        input.dispatchEvent(new Event('input'));
        await nextTick();

        form.dispatchEvent(new Event('submit'));
        await nextTick();
        expect(onSubmit).toHaveBeenCalledWith({ username: 'CanDeveloper' });
    });
});