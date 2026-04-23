import { renderToString } from '../src/server-renderer/index.ts';
import { Component } from '../src/runtime-core/Component.ts';
import { signal } from '../src/reactivity/signal.ts';

// Mock of the compiled AsyncWidget component
class AsyncWidget extends Component {
    constructor() {
        super();
        this.data = signal("Loading...");
    }

    async onBeforeMount() {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 100));
        this.data.value = "Data loaded from API!";
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <div class="widget">
                    <p>${this.data.value}</p>
                </div>
            `;
        }
    }
}

console.log('--- Running Async Widget Demo (SSR) ---');
renderToString(AsyncWidget).then(html => {
    console.log('Generated HTML:', html);
    console.log(html.includes('Data loaded from API!') ? '✅ PASS' : '❌ FAIL');
});