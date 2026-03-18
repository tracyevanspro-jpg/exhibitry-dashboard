import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notes: resolve(__dirname, 'notes.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  }
});
