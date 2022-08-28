import {
  NumberControl as NumberControlMC,
  TextControl as TextControlMC,
  BooleanControl as BooleanControlMC,
  ColorControl as ColorControlMC,
  ButtonControl as ButtonControlMC,
} from '@magic-circle/client';

import createWrapper from './wrapper';

export const NumberControl = createWrapper<
  number,
  NumberControlMC,
  { range?: [number, number]; stepSize?: number }
>(NumberControlMC, (instance, { range, stepSize }) => {
  if (range) {
    instance.range(range[0], range[1]);
  }

  if (stepSize) {
    instance.stepSize(stepSize);
  }
});

export const TextControl = createWrapper<
  string,
  TextControlMC,
  { keys?: string[]; labels?: string[] }
>(TextControlMC, (instance, { keys, labels }) => {
  if (keys) {
    instance.selection(keys, labels);
  }
});

export const ColorControl = createWrapper<
  ColorControlMC['value'],
  ColorControlMC,
  { range?: number; rangeAlpha?: number; alpha?: boolean }
>(ColorControlMC, (instance, { range, rangeAlpha, alpha }) => {
  if (range) {
    instance.range(range, rangeAlpha);
  }
  if (alpha !== undefined) {
    instance.alpha(alpha);
  }
});

export const ButtonControl = createWrapper<
  ButtonControlMC['value'],
  ButtonControlMC,
  Record<string, never>
>(TextControlMC);

export const BooleanControl = createWrapper<
  boolean,
  BooleanControlMC,
  { keys?: string[]; labels?: string[] }
>(BooleanControlMC);
