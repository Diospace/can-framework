import { describe, test, expect } from 'vitest';
import { transpile } from '../src/compiler/codegen';

describe('Compiler', () => {
    test('should transform component to class', async () => {
        const source = `
            component TestComponent {
                var template = '<div>Hello</div>';
            }
        `;
        const { code: output } = await transpile(source, [], 'test.can');
        
        expect(output).toContain('export class TestComponent extends _baseClass');
        // Check for auto-registration (PascalCase -> kebab-case)
        expect(output).toContain('defineCustomElement(_tagName, TestComponent');
    });

    test('should compile signals', async () => {
        const source = `
            import { signal } from '../reactivity/signal';
            component SignalTest {
                var count = signal(0);
                var template = '<p>{{count}}</p>';
            }
        `;
        const { code: output } = await transpile(source, [], 'test.can');
        
        expect(output).toContain('this.count = signal(0)');
        // Verify that the template is preserved or processed
        expect(output).toContain('render()');
    });
});