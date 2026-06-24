import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Resolve `react-flip-cards` to the library source in this repo, so the demo
// always reflects the current code with no build/copy step. (Absolute path —
// Ladle runs with its own package as the root.)
const libSource = fileURLToPath(new URL('../src/index.ts', import.meta.url));

export default defineConfig({
  resolve: {
    alias: { 'react-flip-cards': libSource },
    dedupe: ['react', 'react-dom']
  },
  esbuild: { jsx: 'automatic' },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}']
  }
});
