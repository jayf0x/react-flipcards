import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'oxc',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactFlipCards',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      // Don't bundle React — consumers bring their own.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        exports: 'named',
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
        // Emit the stylesheet as dist/index.css.
        assetFileNames: 'index.[ext]'
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    include: ['test/**/*.spec.{ts,tsx}'],
    css: true
  }
});
