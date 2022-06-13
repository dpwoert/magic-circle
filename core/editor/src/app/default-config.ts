import { TextControl, NumberControl } from '@magic-circle/controls/editor';
import PlayControls from '@magic-circle/play-controls';
import Layers from '@magic-circle/layers';
import { Config, BuildTarget } from '@magic-circle/schema';

const config: Config = {
  url: '',
  plugins: [Layers, PlayControls],
  controls: [TextControl, NumberControl],
  theme: {
    accent: 'string',
  },
  settings: {},
  target: BuildTarget.IFRAME,
};

export default config;
