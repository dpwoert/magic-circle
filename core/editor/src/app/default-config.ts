import PlayControls from '@magic-circle/play-controls';
import Layers from '@magic-circle/layers';
import type { Config } from '@magic-circle/schema';

const config: Config = {
  url: '',
  plugins: [Layers, PlayControls],
  theme: {
    accent: 'string',
  },
  settings: {},
};

export default config;
