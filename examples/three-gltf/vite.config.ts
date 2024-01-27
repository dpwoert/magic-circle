import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
    strictPort: true,
  },
  resolve: {
    dedupe: ['three'],
  },
  base: process.env.NODE_ENV === 'production' ? '/examples/three-gltf/' : '/',
});
