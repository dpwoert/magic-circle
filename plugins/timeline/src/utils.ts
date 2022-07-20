export function lerp(t: number, start: number, end: number): number {
  return start * (1 - t) + end * t;
}

export function addDigit(number: number): string {
  return number < 10 ? `0${number}` : String(number);
}

export function formatTime(t: number) {
  const ms = t % 1000;
  let s = (t - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;

  return `${addDigit(mins)}:${addDigit(secs)}:${addDigit(
    Math.floor(ms / 100)
  )}`;
}
