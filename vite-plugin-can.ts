import { transpile } from './src/compiler/codegen';

export default function canPlugin() {
  return {
    name: 'vite-plugin-can',
    transform(code: string, id: string) {
      if (id.endsWith('.can')) {
        return transpile(code, [], id);
      }
    }
  };
}