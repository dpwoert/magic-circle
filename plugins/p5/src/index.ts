/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
import type P5 from 'p5';
import type { MagicCircle } from '@magic-circle/client';

import draw from './draw';

export default function createSketch(magicCircle: MagicCircle, p5: P5) {
  const global = (preload?: () => void) => {
    globalThis.preload = () => {
      // eslint-disable-next-line
      p5.instance._draw = () => {};

      if (preload) preload();
    };

    const loop = (delta: number) => {
      if (p5.instance) {
        draw(p5.instance, delta);
      }
    };

    return magicCircle.loop(loop);
  };

  const instance = (s: (p: P5) => void, element?: HTMLElement) => {
    let sketch;

    const setup = () => {
      sketch = new p5(s, element);
      // eslint-disable-next-line
      sketch._draw = () => {};
    };

    const loop = (delta: number) => {
      draw(sketch, delta);
    };

    return magicCircle.setup(setup).loop(loop);
  };

  return { global, instance };
}
