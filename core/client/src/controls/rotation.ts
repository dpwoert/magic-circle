import Control from '../control';
import { lerp } from '../utils/math';

type options = {
  mode?: 'radians' | 'degrees';
  range?: number[];
  stepSize?: number;
};

export default class RotationControl extends Control<number, options> {
  type = 'rotation';

  /**
   * Sets rotation mode for control. Either radians or degrees.
   */
  mode(mode: options['mode']) {
    this.options.mode = mode;
    return this;
  }

  /**
   * Sets range of values,
   * user can only set values between start and end value.
   *
   * @param hook Function that has child and path as arguments
   */
  range(start: number, end: number) {
    this.options.range = [start, end];
    return this;
  }

  /**
   * Sets step size for control
   */
  stepSize(stepSize: number) {
    this.options.stepSize = stepSize;
    return this;
  }

  interpolate(from: number, to: number, alpha: number) {
    return lerp(from, to, alpha);
  }
}
