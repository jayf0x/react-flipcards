import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // The linked library and this app must share a single React instance.
  resolve: { dedupe: ['react', 'react-dom'] }
});
