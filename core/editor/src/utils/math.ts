export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function mapLinear(
  x: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number
): number {
  return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}

export const randomInt = (low: number, high: number): number =>
  low + Math.floor(Math.random() * (high - low + 1));

export const randomFloat = (low: number, high: number): number =>
  low + Math.random() * (high - low);

export const snap = (
  // current value
  value: number,
  // size of grid
  size: number,
  // max distance for snapping, otherwise value won't be touched
  maxDistance: number
): number => {
  const distance = value % size;
  if (distance < maxDistance) {
    return value - distance;
  }
  if (distance > size - maxDistance) {
    return value + (size - distance);
  }

  return value;
};

export const snapUp = (value: number, size: number) => {
  const amount = value / size;
  return Math.ceil(amount) * size;
};

/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
export const linspace = (a: number, b: number, n?: number): number[] => {
  if (typeof n === 'undefined') n = Math.max(Math.round(b - a) + 1, 1);
  if (n < 2) {
    return n === 1 ? [a] : [];
  }
  const ret = Array(n);
  n--;
  for (let i = n; i >= 0; i--) {
    ret[i] = (i * b + (n - i) * a) / n;
  }
  return ret;
};

export const countDecimalDigits = (x: number) => {
  if (!x || Math.floor(x) === x) return 0;
  return x.toString().split('.')[1].length || 0;
};

export const roundSignificant = (number: number, precision: number) => {
  if (typeof number === 'undefined' || number === null) return '';

  if (number === 0) return '0';

  const roundedValue = +number.toPrecision(precision);
  const floorValue = Math.floor(roundedValue);

  const isInteger = Math.abs(floorValue - roundedValue) < Number.EPSILON;

  const numberOfFloorDigits = String(floorValue).length;
  const numberOfDigits = String(roundedValue).length;

  if (numberOfFloorDigits > precision) {
    return String(floorValue);
  }
  const padding = isInteger
    ? precision - numberOfFloorDigits
    : precision - numberOfDigits + 1;

  if (padding > 0) {
    if (isInteger) {
      return `${String(floorValue)}.${'0'.repeat(padding)}`;
    }
    return `${String(roundedValue)}${'0'.repeat(padding)}`;
  }
  return String(roundedValue);
};

export const pythagorean = (sideA: number, sideB: number) => {
  return Math.sqrt(sideA ** 2 + sideB ** 2);
};
