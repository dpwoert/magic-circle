import Regl from 'regl';

import {
  MagicCircle,
  NumberControl,
  ColorControl,
  Layer,
  Folder,
} from '@magic-circle/client';

import noiseVert from './shaders/noise.vert.glsl';
import noiseFrag from './shaders/noise.frag.glsl';
import isoLinesVert from './shaders/isolines.vert.glsl';
import isoLinesFrag from './shaders/isolines.frag.glsl';

export default function create() {
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
    // container: 'canvas',
    // pixelRatio: window.devicePixelRatio,
    // // pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    // attributes: {
    //   antialias: true,
    //   stencil: false,
    //   depth: true,
    //   alpha: true,
    // },
    // extensions: ['OES_standard_derivatives'],
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
      frequency: regl.prop<typeof settings, keyof typeof settings>('frequency'),
      persistence: regl.prop<typeof settings, keyof typeof settings>(
        'persistence'
      ),
      offset: regl.prop<typeof settings, keyof typeof settings>('offset'),
      // time: regl.context('time'),
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
      color: () => settings.color.map((c) => c / 255).splice(0, 3),
      screenShape: ({ viewportWidth, viewportHeight }) => [
        viewportWidth,
        viewportHeight,
      ],
      // time: regl.context('time'),
    },
    count: 3,
  });

  return {
    setup: (gui: MagicCircle) => {
      const noise = new Layer('Noise').addTo(gui.layer);
      const fx = new Layer('Isoline').addTo(gui.layer);
      const colorsFolder = new Folder('Color').addTo(fx);
      const linesFolder = new Folder('Lines').addTo(fx);
      const animationFolder = new Folder('Animation').addTo(fx);

      noise.add([
        new NumberControl(settings, 'frequency').range(0, 20),
        new NumberControl(settings, 'amplitude').range(0, 200),
        new NumberControl(settings, 'peaks').range(0, 3),
        new NumberControl(settings, 'persistence').range(0, 3),
      ]);

      colorsFolder.add([
        new ColorControl(settings, 'backgroundColor'),
        new ColorControl(settings, 'color').label('Line color'),
      ]);

      linesFolder.add([
        new NumberControl(settings, 'lineWidth').range(0, 1).stepSize(0.001),
        new NumberControl(settings, 'segmentHeight').range(0, 2).stepSize(0.01),
        new NumberControl(settings, 'antialiasing')
          .range(0.001, 1)
          .stepSize(0.001),
        new NumberControl(settings, 'minAlpha').range(0, 1).stepSize(0.01),
      ]);

      animationFolder.add([
        new NumberControl(settings, 'speed').range(0, 1).stepSize(0.01),
      ]);

      // eslint-disable-next-line
      return regl._gl.canvas;
    },
    loop: (delta: number) => {
      settings.offset += (delta * settings.speed) / 1000000;
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
