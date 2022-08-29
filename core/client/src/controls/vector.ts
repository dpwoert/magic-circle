import Control from '../control';
import { lerp } from '../utils/math';

type vector = number[] | { x: number; y: number; z?: number };

export default class VectorControl extends Control<vector> {
  dimensions: 2 | 3;
  mode: 'array' | 'object';

  type = 'vector';

  constructor(reference: Control<vector>['reference'], key: string) {
    super(reference, key);

    this.mode = Array.isArray(this.value) ? 'array' : 'object';

    // Get dimensions
    if (Array.isArray(this.value) && this.value.length > 2) {
      this.dimensions = 3;
    } else if (Array.isArray(this.value) && this.value.length < 3) {
      this.dimensions = 2;
    } else if (!Array.isArray(this.value) && this.value.z) {
      this.dimensions = 3;
    } else {
      this.dimensions = 2;
    }
  }

  range(start: number, end: number) {
    this.options.range = [start, end];
    return this;
  }

  precision(digits: number) {
    this.options.precision = digits;
    return this;
  }

  defaultSecondaryAxis(axis: 'y' | 'z') {
    this.options.defaultSecondaryAxis = axis;
    return this;
  }

  // interpolate(from: number, to: number, alpha: number) {
  // return lerp(from, to, alpha);
  // }
}
