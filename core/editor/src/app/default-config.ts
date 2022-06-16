import PlayControls from '@magic-circle/play-controls';
import Layers from '@magic-circle/layers';
import Screenshots from '@magic-circle/screenshots';
import Performance from '@magic-circle/performance';

import { TextControl, NumberControl } from '@magic-circle/controls/editor';

import { Config, BuildTarget } from '@magic-circle/schema';

const config: Config = {
  url: '',
  plugins: [Layers, PlayControls, Screenshots, Performance],
  controls: [TextControl, NumberControl],
  theme: {
    accent: 'string',
  },
  settings: {},
  target: BuildTarget.IFRAME,
};

export default config;
