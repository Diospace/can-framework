import { describe, test, expect } from 'vitest';
import { transpile } from '../src/compiler/codegen';

describe('Compiler', () => {
    test('should transform component to class', () => {
        const source = `
            component TestComponent {
                var template = '<div>Hello</div>';
            }
        `;
        const output = transpile(source);
        
        expect(output).toContain('class TestComponent extends Component');
        // Check for auto-registration (PascalCase -> kebab-case)
        expect(output).toContain("customElements.define('test-component', TestComponent)");
    });

    test('should compile signals', () => {
        const source = `
            import { signal } from '../reactivity/signal';
            component SignalTest {
                var count = signal(0);
                var template = '<p>{{count}}</p>';
            }
        `;
        const output = transpile(source);
        
        expect(output).toContain('count = signal(0)');
        // Verify that the template is preserved or processed
        expect(output).toContain('template =');
    });
});