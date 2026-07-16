import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/caramel-teddy-care/',
  build: {
    target: 'es2022',
    assetsInlineLimit: 4096,
  },
});
