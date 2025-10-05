import { defineConfig } from 'vite';
import { writeFileSync } from 'fs';

export default defineConfig({
  base: '/markdown-pulse/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  plugins: [{
    name: 'add-nojekyll',
    closeBundle() {
      writeFileSync('dist/.nojekyll', '');
    }
  }]
});
