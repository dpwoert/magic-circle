/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
export default function draw(sketchInstance: any, delta: number) {
  // mandatory update values(matrixes and stack)
  sketchInstance.redraw();
  sketchInstance._frameRate = 1000.0 / delta;
  sketchInstance.deltaTime = delta;
  sketchInstance._setProperty('deltaTime', delta);
  sketchInstance._lastFrameTime = Date.now();

  // If the user is actually using mouse module, then update
  // coordinates, otherwise skip. We can test this by simply
  // checking if any of the mouse functions are available or not.
  // NOTE : This reflects only in complete build or modular build.
  if (typeof sketchInstance._updateMouseCoords !== 'undefined') {
    sketchInstance._updateMouseCoords();

    // reset delta values so they reset even if there is no mouse event to set them
    // for example if the mouse is outside the screen
    sketchInstance._setProperty('movedX', 0);
    sketchInstance._setProperty('movedY', 0);
  }
}
