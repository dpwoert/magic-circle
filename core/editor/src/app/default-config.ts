import { Config } from '@magic-circle/schema';

const plugins = async () => [
  (await import('@magic-circle/layers')).default,
  (await import('@magic-circle/play-controls')).default,
  (await import('@magic-circle/seed')).default,
  (await import('@magic-circle/screenshots')).default,
  (await import('@magic-circle/recordings')).default,
  (await import('@magic-circle/performance')).default,
  (await import('@magic-circle/timeline')).default,
];

const controls = async () => {
  const controls = await import('@magic-circle/controls');
  return [
    controls.TextControl,
    controls.NumberControl,
    controls.ColorControl,
    controls.ButtonControl,
    controls.BooleanControl,
    controls.ImageControl,
    controls.VectorControl,
    controls.RotationControl,
  ];
};

const config: Config = {
  url: '',
  projectName: process.env.PROJECT_NAME,
  plugins,
  controls,
  settings: {
    layers: {
      hydrate: true,
    },
    screenshots: {
      directoryBasedOnFrameUrl: false,
      gitInfo: true,
      share: true,
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
