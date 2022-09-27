// import PlayControls from '@magic-circle/play-controls';
// import Layers from '@magic-circle/layers';
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
  ImageControl,
  VectorControl,
} from '@magic-circle/controls';

import { Config, Plugin, PluginConstructor } from '@magic-circle/schema';

const plugins = async () => [
  (await import('@magic-circle/layers')).default,
  (await import('@magic-circle/play-controls')).default,
  (await import('@magic-circle/seed')).default,
  (await import('@magic-circle/screenshots')).default,
  (await import('@magic-circle/recordings')).default,
  (await import('@magic-circle/performance')).default,
  (await import('@magic-circle/timeline')).default,
];

const config: Config = {
  url: '',
  projectName: process.env.PROJECT_NAME,
  // plugins: [
  //   Layers,
  //   PlayControls,
  //   Seed,
  //   Screenshots,
  //   Recordings,
  //   Performance,
  //   Timeline,
  // ],
  plugins,
  controls: [
    TextControl,
    NumberControl,
    ColorControl,
    ButtonControl,
    BooleanControl,
    ImageControl,
    VectorControl,
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
};

export default config;
