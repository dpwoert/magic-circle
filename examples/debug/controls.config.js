import Debug from '@magic-circle/debug';
import Recordings from '@magic-circle/recordings';

module.exports = {
  plugins: defaultPlugins => [...defaultPlugins, Debug, Recordings],
};
