import Control from '../control';
import { lerp } from '../utils/math';

type vector = number[] | { x: number; y: number; z?: number };

type options = {
  range?: number[];
  precision?: number;
  defaultSecondaryAxis?: string;
};

export default class VectorControl extends Control<vector, options> {
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

  interpolate(from: vector, to: vector, alpha: number) {
    const toSafe = Array.isArray(to) ? to : [to.x, to.y, to.z];

    if (Array.isArray(from)) {
      return from.map((v, i) => lerp(v, toSafe[i], alpha));
    }

    if (this.dimensions === 2) {
      return {
        x: lerp(from.x, toSafe[0], alpha),
        y: lerp(from.y, toSafe[1], alpha),
      };
    }

    return {
      x: lerp(from.x, toSafe[0], alpha),
      y: lerp(from.y, toSafe[1], alpha),
      z: lerp(from.z, toSafe[2], alpha),
    };
  }
}
