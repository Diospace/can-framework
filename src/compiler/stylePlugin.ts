import postcss from 'postcss';

export async function compileStyle(css: string, scopeId: string): Promise<string> {
  const scopePlugin = {
    postcssPlugin: 'scope-plugin',
    Rule(rule: any) {
      rule.selectors = rule.selectors.map((selector: string) => {
        const s = selector.trim();
        if (s === 'to' || s === 'from' || /^\d/.test(s)) {
          return s;
        }
        return `${s}[data-v-${scopeId}]`;
      });
    }
  };
 // (scopePlugin as any).postcss = true;

  const result = await postcss([scopePlugin]).process(css, { from: undefined });
  return result.css;
}