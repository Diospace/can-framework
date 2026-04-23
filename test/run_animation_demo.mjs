import { renderToString } from '../src/server-renderer/index.ts';
import { Component } from '../src/runtime-core/Component.ts';
import { signal } from '../src/reactivity/signal.ts';

// Mock of the compiled AnimationDemo component
class AnimationDemo extends Component {
    constructor() {
        super();
        this.isVisible = signal(false);
        this.statusText = signal("Hidden");
        this.boxClass = signal("box hidden");
    }

    // Simulate the compiler's output: rendering based on state
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <div class="anim-container">
                    <p>Status: ${this.statusText.value}</p>
                    <div class="${this.boxClass.value}"></div>
                </div>
            `;
        }
    }
}

console.log('--- Running Animation Demo (SSR) ---');
renderToString(AnimationDemo).then(html => {
    console.log('Generated HTML:');
    console.log(html);
    
    // Simple assertion
    const passed = html.includes('Status: Hidden') && html.includes('class="box hidden"');
    console.log(passed ? '✅ PASS' : '❌ FAIL');
});