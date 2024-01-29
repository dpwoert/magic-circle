import DemoPlugin from './dist/index.jsx';

export default {
  url: (dev) =>
    dev ? 'http://localhost:4000' : 'https://gltf.magic-circle.dev/viewer',
  plugins: (defaultPlugins) => [
    ...defaultPlugins.filter((p) => p.name !== 'seed'),
    DemoPlugin,
  ],
  settings: {
    pageTitle: 'Three.JS GLTF editor (beta) by Magic Circle',
    directoryBasedOnFrameUrl: true,
    screenshots: {
      gitInfo: false,
    },
  },
};
