import Test from './plugin/plugin';

module.exports = {
  plugins: defaultPlugins => [...defaultPlugins, Test],
};
