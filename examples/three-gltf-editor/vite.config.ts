import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
    strictPort: true,
  },
  base:
    process.env.NODE_ENV === 'production'
      ? '/examples/three-gltf-editor/'
      : '/',
  // resolve: {
  //   dedupe: ['react', 'react-dom', 'react-is'],
  // },
  plugins: [react(), svgr()],
});
