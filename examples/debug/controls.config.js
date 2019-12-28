import Debug from '@magic-circle/debug';
import Recordings from '@magic-circle/recordings';
import Midi from '@magic-circle/midi';

module.exports = {
  plugins: defaultPlugins => [...defaultPlugins, Debug, Recordings, Midi],
  recordings: {
    enableFFMPEG: true,
  },
};
