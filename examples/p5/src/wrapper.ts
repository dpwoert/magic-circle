import p5 from 'p5';

import { MagicCircle } from '@magic-circle/client';

const createSketch = (
  factory: (gui: MagicCircle) => (s: p5) => void,
  element?: HTMLElement
) => {
  let sketchInstance: p5;

  const setup = (gui: MagicCircle) => {
    const sketch = factory(gui);
    sketchInstance = new p5(sketch, element);
    // @ts-expect-error
    sketchInstance._loop = true;

    // @ts-expect-error
    return sketchInstance.canvas;
  };

  // interpreted from https://github.com/processing/p5.js/blob/7d193c34665b8771596f01c8774e1e4c2d7f064b/src/core/main.js#L362
  const loop = (delta: number) => {
    //mandatory update values(matrixes and stack)
    sketchInstance.redraw();
    // @ts-expect-error
    sketchInstance._frameRate = 1000.0 / delta;
    sketchInstance.deltaTime = delta;
    // @ts-expect-error
    sketchInstance._setProperty('deltaTime', delta);
    // @ts-expect-error
    sketchInstance._lastFrameTime = Date.now();

    // If the user is actually using mouse module, then update
    // coordinates, otherwise skip. We can test this by simply
    // checking if any of the mouse functions are available or not.
    // NOTE : This reflects only in complete build or modular build.
    // @ts-expect-error
    if (typeof sketchInstance._updateMouseCoords !== 'undefined') {
      // @ts-expect-error
      sketchInstance._updateMouseCoords();

      //reset delta values so they reset even if there is no mouse event to set them
      // for example if the mouse is outside the screen
      // @ts-expect-error
      sketchInstance._setProperty('movedX', 0);
      // @ts-expect-error
      sketchInstance._setProperty('movedY', 0);
    }
  };

  return new MagicCircle().setup(setup).loop(loop);
};

export default createSketch;
