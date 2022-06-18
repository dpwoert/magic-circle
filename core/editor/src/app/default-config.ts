import PlayControls from '@magic-circle/play-controls';
import Layers from '@magic-circle/layers';
import Screenshots from '@magic-circle/screenshots';
import Performance from '@magic-circle/performance';
import Recordings from '@magic-circle/recordings';
import Seed from '@magic-circle/seed';

import {
  TextControl,
  NumberControl,
  ColorControl,
  ButtonControl,
  BooleanControl,
} from '@magic-circle/controls/editor';

import { Config, BuildTarget } from '@magic-circle/schema';

const config: Config = {
  url: '',
  plugins: [Layers, PlayControls, Seed, Screenshots, Recordings, Performance],
  controls: [
    TextControl,
    NumberControl,
    ColorControl,
    ButtonControl,
    BooleanControl,
  ],
  theme: {
    accent: 'string',
  },
  settings: {},
  target: BuildTarget.IFRAME,
};

export default config;
