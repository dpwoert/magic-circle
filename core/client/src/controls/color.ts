import Control from '../control';

type color = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

type color2 = {
  red?: number;
  green?: number;
  blue?: number;
  alpha?: number;
};

export default class ColorControl extends Control<
  string | number | number[] | color | color2
> {
  type = 'color';

  range(range = 255, alpha = 1) {
    this.options.range = range;
    this.options.rangeAlpha = alpha;
    return this;
  }

  alpha(alpha = true) {
    this.options.alpha = alpha;
    return this;
  }
}
