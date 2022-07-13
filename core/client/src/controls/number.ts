import Control from '../control';

export default class NumberControl extends Control<string> {
  type = 'number';

  range(start: number, end: number) {
    this.options.range = [start, end];
    return this;
  }

  stepSize(size: number) {
    this.options.stepSize = size;
    return this;
  }
}
