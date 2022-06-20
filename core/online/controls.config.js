import DemoPlugin from './dist/index.jsx';

export default {
  url: 'http://localhost:4000',
  plugins: (defaultPlugins) => [...defaultPlugins, DemoPlugin],
};
