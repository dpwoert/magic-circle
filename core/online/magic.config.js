import DemoPlugin from './dist/index.jsx';

export default {
  url: 'https://playground.magic-circle.dev/examples/simple',
  plugins: (defaultPlugins) => [DemoPlugin, ...defaultPlugins],
  settings: {
    title: '{title}',
    directoryBasedOnFrameUrl: true,
    screenshots: {
      gitInfo: false,
    },
  },
};
