import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 3001,
  },
});
