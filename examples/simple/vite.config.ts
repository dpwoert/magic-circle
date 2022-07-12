import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
    strictPort: true,
  },
  base: process.env.NODE_ENV === 'production' ? '/examples/simple/' : '/',
});
