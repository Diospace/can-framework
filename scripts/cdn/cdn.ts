import * as reactivity from '../../src/reactivity/index';
import * as runtime from '../../src/runtime-core/index';
import * as router from '../../src/router/index';
import { compileDOM, createApp } from './runtime-compiler';

/**
 * The Global CDN version of the Can Framework.
 * Includes Router support for full SPA capabilities via script tag.
 */
const Can = {
    ...reactivity,
    ...runtime,
    router,
    /**
     * Full-featured createApp for the CDN build.
     * Supports data(), methods, computed, and lifecycle hooks.
     */
    createApp
};

if (typeof window !== 'undefined') {
    // Ensure window.Can is a flat object containing createApp
    const globalCan = (window as any).Can || ((window as any).Can = {});
    Object.assign(globalCan, Can);
    // Optional: Also expose createApp directly if you want Vue-parity: window.createApp = Can.createApp;
}

export default Can;