import DemoPlugin from './dist/index.jsx';

export default {
  url: 'https://magic-circle.dev/examples/simple',
  plugins: (defaultPlugins) => [DemoPlugin, ...defaultPlugins],
};
