import { defineConfig } from 'vite';
import canPlugin from './vite-plugin-can';

export default defineConfig({
  plugins: [canPlugin()],
  server: {
    open: '/examples/index.html'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});