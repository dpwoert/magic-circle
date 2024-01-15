import DemoPlugin from './dist/index.jsx';

export default {
  url: 'https://gltf.magic-circle.dev/viewer',
  plugins: (defaultPlugins) => [DemoPlugin, ...defaultPlugins],
  settings: {
    pageTitle: '{title}',
    directoryBasedOnFrameUrl: true,
    screenshots: {
      gitInfo: false,
    },
  },
};
