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
