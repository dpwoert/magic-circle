import {
  NumberControl as NumberControlMC,
  TextControl as TextControlMC,
} from '@magic-circle/client';

import createWrapper from './Wrapper';

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
