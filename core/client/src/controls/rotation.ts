import Control from '../control';
import { lerp } from '../utils/math';

type options = {
  mode?: 'radians' | 'degrees';
  range?: number[];
  stepSize?: number;
};

export default class RotationControl extends Control<number, options> {
  type = 'rotation';

  mode(mode: options['mode']) {
    this.options.mode = mode;
    return this;
  }

  range(start: number, end: number) {
    this.options.range = [start, end];
    return this;
  }

  stepSize(stepSize: number) {
    this.options.stepSize = stepSize;
    return this;
  }

  interpolate(from: number, to: number, alpha: number) {
    return lerp(from, to, alpha);
  }
}
