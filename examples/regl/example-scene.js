import Regl from 'regl';

import { NumberControl, ColorControl } from '@magic-circle/client';

import noiseVert from './shaders/noise.vert.glsl';
import noiseFrag from './shaders/noise.frag.glsl';
import isoLinesVert from './shaders/isolines.vert.glsl';
import isoLinesFrag from './shaders/isolines.frag.glsl';

export default function create() {
  const canvas = document.querySelector('#canvas');

  // default settings
  const settings = {
    frequency: 3.5,
    amplitude: 100,
    persistence: 0.35,
    peaks: 1,
    offset: Math.random() * 10,
    segmentHeight: 0.06,
    lineWidth: 0.027,
    minAlpha: 0.0,
    antialiasing: 0.0001,
    speed: 0.1,
    backgroundColor: '#111',
    color: [177, 40, 40],
  };

  const regl = Regl({
    container: canvas,
    pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    attributes: {
      antialias: true,
      stencil: false,
      depth: true,
      alpha: true,
    },
    extensions: ['OES_standard_derivatives'],
  });

  const fbo = regl.framebuffer({
    width: 1024,
    height: 1024,
    // colorType: 'float',
    // colorFormat: 'rgba',
  });

  const setFBO = regl({
    framebuffer: fbo,
  });

  const drawNoise = regl({
    vert: noiseVert,
    frag: noiseFrag,
    uniforms: {
      frequency: regl.prop('frequency'),
      persistence: regl.prop('persistence'),
      offset: regl.prop('offset'),
      time: regl.context('time'),
    },
    attributes: {
      position: [-4, -4, 4, -4, 0, 4],
    },
    count: 3,
  });

  const drawIsolines = regl({
    frag: isoLinesFrag,
    vert: isoLinesVert,

    attributes: {
      position: [-4, -4, 4, -4, 0, 4],
    },
    uniforms: {
      noise: () => fbo,
      amplitude: () => settings.amplitude,
      peaks: () => settings.peaks,
      segmentHeight: () => settings.segmentHeight,
      lineWidth: () => settings.lineWidth,
      minAlpha: () => settings.minAlpha,
      persistence: () => settings.persistence,
      antialiasing: () => settings.antialiasing,
      color: () => settings.color.map(c => c / 255).splice(0, 3),
      screenShape: ({ viewportWidth, viewportHeight }) => [
        viewportWidth,
        viewportHeight,
      ],
      time: regl.context('time'),
    },
    count: 3,
  });

  return {
    setup: gui => {
      const fx = gui.layer('Isoline');

      fx.folder('Colors', [
        new ColorControl(settings, 'backgroundColor'),
        new ColorControl(settings, 'color').label('Line color'),
      ]);

      fx.folder('Noise', [
        new NumberControl(settings, 'frequency').range(0, 20),
        new NumberControl(settings, 'amplitude').range(0, 200),
        new NumberControl(settings, 'peaks').range(0, 3),
        new NumberControl(settings, 'persistence').range(0, 3),
      ]);

      fx.folder('Lines', [
        new NumberControl(settings, 'lineWidth').range(0, 1).stepSize(0.001),
        new NumberControl(settings, 'segmentHeight').range(0, 2),
        new NumberControl(settings, 'antialiasing').range(0.001, 1),
        new NumberControl(settings, 'minAlpha').range(0, 1),
      ]);

      fx.folder('Animation', [
        new NumberControl(settings, 'speed').range(0, 1),
      ]);
    },
    loop: delta => {
      settings.offset += (delta * settings.speed) / 10;

      document.body.style.backgroundColor = settings.backgroundColor;

      // renders noise to a buffer
      setFBO(() => {
        regl.clear({
          color: [0, 0, 0, 255],
          depth: 1,
        });

        drawNoise({ ...settings });
      });

      drawIsolines();
    },
  };
}
