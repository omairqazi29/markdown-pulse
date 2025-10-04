import { defineConfig } from 'vite';

export default defineConfig({
  base: '/markdown-pulse/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
