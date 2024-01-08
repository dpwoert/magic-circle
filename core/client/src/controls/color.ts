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

type options = {
  range?: number;
  rangeAlpha?: number;
  alpha?: boolean;
};

export default class ColorControl extends Control<
  string | number | number[] | color | color2,
  options
> {
  type = 'color';

  /**
   * Loop through all children recursively.
   *
   * @param range Sets the range for the color channels. Default is 255.
   * @param alpha Sets the range for the alpha channel, if used. Default is 1.
   */
  range(range = 255, alpha = 1) {
    this.options.range = range;
    this.options.rangeAlpha = alpha;
    return this;
  }

  /**
   * Determines if the alpha channel is used for this control
   */
  alpha(alpha = true) {
    this.options.alpha = alpha;
    return this;
  }
}
