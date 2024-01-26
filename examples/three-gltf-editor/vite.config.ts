import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

let base =
  process.env.NODE_ENV === 'production' ? '/examples/three-gltf-editor/' : '/';

// GLTF viewer has different export path
if (process.env.EXPORT_ENV === 'gltf') {
  base = '/viewer/';
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
    strictPort: true,
  },
  base,
  resolve: {
    dedupe: ['three'],
  },
  plugins: [react(), svgr()],
});
