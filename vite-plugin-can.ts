import { transpile } from './src/compiler/codegen';
import { fixImports, getOutputPath } from './src/cli/build'; // Import fixImports and getOutputPath
import * as path from 'path'; // Import path module

export default function canPlugin() {
  return {
    name: 'vite-plugin-can',
    async transform(code: string, id: string) {
      if (id.endsWith('.can')) {
        const { code: transpiledCode, map } = await transpile(code, [], id, frameworkImport);

        // Calculate frameworkImport for Vite's context
        const cwd = process.cwd();
        const distDir = path.join(cwd, 'dist'); // Assuming Vite builds to 'dist'
        const srcDir = path.join(cwd, 'src'); // Assuming user project src is in 'src'

        // Determine the output path for the current .can file
        // This logic should mirror how `can build` determines output paths
        let currentFileOutputPath: string;
        if (id.startsWith(srcDir)) {
          currentFileOutputPath = getOutputPath(id, srcDir, distDir, '.mjs');
        } else if (id.startsWith(path.join(cwd, 'examples'))) {
          currentFileOutputPath = getOutputPath(id, path.join(cwd, 'examples'), path.join(distDir, 'examples'), '.mjs');
        } else {
          // Fallback for other locations, assuming they go to dist root
          currentFileOutputPath = getOutputPath(id, path.dirname(id), distDir, '.mjs');
        }

        const frameworkDistPath = path.join(distDir, 'can-framework.mjs');
        let frameworkImport = path.relative(path.dirname(currentFileOutputPath), frameworkDistPath).replace(/\\/g, '/');
        if (!frameworkImport.startsWith('.')) {
          frameworkImport = './' + frameworkImport;
        }

        // Apply fixImports to replace the placeholder and handle other relative imports
        const finalCode = fixImports(transpiledCode, id, frameworkImport);

        return {
          code: finalCode,
          map: map
        };
      }
    }
  };
}