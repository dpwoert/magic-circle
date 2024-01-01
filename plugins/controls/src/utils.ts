export const mapLinear = (
  x: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number
): number => b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};

export const nrDigits = (val: number): number => {
  const split = String(val).split('.');
  return split.length > 1 ? split[1].length : 0;
};
