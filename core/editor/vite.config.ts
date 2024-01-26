import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // process.env.STATS && visualizer()
  ],
  resolve: {
    dedupe: ['styled-components', 'react', 'react-dom', 'react-is', 'three'],
  },
});
