import Debug from '@creative-controls/debug';

module.exports = {
  plugins: defaultPlugins => [...defaultPlugins, Debug],
};
