import Debug from '@magic-circle/debug';

module.exports = {
  plugins: defaultPlugins => [...defaultPlugins, Debug],
};
