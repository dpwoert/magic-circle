import Control from '../control';
import { lerp } from '../utils/math';

type options = {
  stepSize?: number;
  range?: number[];
};

export default class NumberControl extends Control<number, options> {
  type = 'number';

  range(start: number, end: number) {
    this.options.range = [start, end];
    return this;
  }

  stepSize(size: number) {
    this.options.stepSize = size;
    return this;
  }

  interpolate(from: number, to: number, alpha: number) {
    return lerp(from, to, alpha);
  }
}
