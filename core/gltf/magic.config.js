import DemoPlugin from './dist/index.jsx';

export default {
  url: 'https://gltf.magic-circle.dev/viewer',
  plugins: (defaultPlugins) => [DemoPlugin, ...defaultPlugins],
  settings: {
    pageTitle: 'Three.JS GLTF editor by Magic Circle',
    directoryBasedOnFrameUrl: true,
    screenshots: {
      gitInfo: false,
    },
  },
};
