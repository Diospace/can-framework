// import { cHtml } from '../runtime-core/html';
// import { signal } from '../reactivity/signal';

// const content = signal('<strong>Hello</strong> <script>alert("XSS")</script>');
// const div = document.createElement('div');

// // Renders: <strong>Hello</strong>
// // The script tag is removed by the sanitizer
// cHtml(div, content);


import { effect } from '../../reactivity/effect';

export function cHtml(el: HTMLElement, value: any) {
    effect(() => {
        const val = unwrap(value);
        const html = val == null ? '' : String(val);
        el.innerHTML = sanitize(html);
    });
}

function unwrap(val: any): any {
    if (typeof val === 'function') return val();
    if (val && typeof val === 'object' && 'value' in val) return val.value;
    return val;
}

function sanitize(html: string): string {
    // Basic sanitization to prevent XSS. 
    // Removes <script> tags, event handlers, and javascript: URIs.
    // Note: For production apps, consider using a robust library like DOMPurify.
    return html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/ on\w+=/gim, " data-blocked-event=")
        .replace(/javascript:/gim, "blocked:");
}
