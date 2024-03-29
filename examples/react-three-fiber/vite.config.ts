import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
    strictPort: true,
  },
  base:
    process.env.NODE_ENV === 'production'
      ? '/examples/react-three-fiber/'
      : '/',
  resolve: {
    dedupe: ['react', 'react-dom', 'react-is'],
  },
  plugins: [react()],
});
