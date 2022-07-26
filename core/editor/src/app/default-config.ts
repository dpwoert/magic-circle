import PlayControls from '@magic-circle/play-controls';
import Layers from '@magic-circle/layers';
import Screenshots from '@magic-circle/screenshots';
import Performance from '@magic-circle/performance';
import Recordings from '@magic-circle/recordings';
import Timeline from '@magic-circle/timeline';
import Seed from '@magic-circle/seed';

import {
  TextControl,
  NumberControl,
  ColorControl,
  ButtonControl,
  BooleanControl,
} from '@magic-circle/controls';

import { Config } from '@magic-circle/schema';

const config: Config = {
  url: '',
  plugins: [
    Layers,
    PlayControls,
    Seed,
    Screenshots,
    Recordings,
    Performance,
    Timeline,
  ],
  controls: [
    TextControl,
    NumberControl,
    ColorControl,
    ButtonControl,
    BooleanControl,
  ],
  settings: {
    screenshots: {
      directoryBasedOnFrameUrl: false,
      gitInfo: true,
    },
    playControls: {
      fullscreen: false,
    },
    recordings: {
      fps: [12, 24, 25, 30, 60],
    },
  },
  // target: BuildTarget.IFRAME,
};

export default config;
