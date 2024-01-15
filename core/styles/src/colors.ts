import colorString from 'color-string';

const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

// convert color in RGB color space [255, 255, 255, 1] to HSL [1, 1, 1, 1]
const rgbToHsl = (color: number[]): number[] => {
  let [r, g, b] = color;
  r /= 255;
  g /= 255;
  b /= 255;
  const a = color[3];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = h;
  const l = h;

  if (max === min) {
    h = 0;
    s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }

    h /= 6;
  }

  return [h, s, l, a];
};

// convert color in HSL color space [1, 1, 1, 1] to RGB [255, 255, 255, 1]
// ts-unused-exports:disable-next-line
export const hslToRgb = (color: number[]): number[] => {
  const [h, s, l, a] = color;
  let r: number;
  let g: number;
  let b: number;

  /* eslint-disable */
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  /* eslint-enable */

  return [r * 255, g * 255, b * 255, a];
};

// ts-unused-exports:disable-next-line
export class Color {
  value: number[];

  constructor(value: string | number[], opacity?: 1) {
    if (Array.isArray(value)) {
      this.value = value;

      if (opacity) {
        this.value[3] = opacity;
      }
    } else {
      this.value = colorString.get.rgb(value);

      if (opacity) {
        this.value[3] = opacity;
      }
    }
  }

  opacity(opacity: number): string;
  opacity(opacity: number, chain: false): string;
  opacity(opacity: number, chain: true): Color;

  opacity(opacity: number, chain?: boolean): unknown {
    const mixed = colorString.to.rgb([...this.value.slice(0, 3), opacity]);

    if (chain) {
      return new Color(mixed);
    }

    return mixed;
  }

  mix(color2: Color | string, a: number): string;
  mix(color2: Color | string, a: number, chain: false): string;
  mix(color2: Color | string, a: number, chain: true): Color;

  mix(color2: Color | string, a: number, chain?: boolean): string | Color {
    const c1 = this.value;
    const c2 =
      typeof color2 === 'string' ? new Color(color2).value : color2.value;
    const mix = [
      lerp(c1[0], c2[0], a),
      lerp(c1[1], c2[1], a),
      lerp(c1[2], c2[2], a),
      lerp(c1[3], c2[3], a),
    ];

    // return as RGB color again
    if (chain) {
      return new Color(mix);
    }

    return colorString.to.rgb(mix);
  }

  equals(color2: Color | string): boolean {
    if (!color2) {
      return false;
    }

    const c1 = this.value;
    const c2 =
      typeof color2 === 'string' ? new Color(color2).value : color2.value;
    return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];
  }

  get hsl() {
    return rgbToHsl(this.value);
  }

  get hex() {
    return colorString.to.hex(this.value);
  }

  get rgb() {
    return colorString.to.rgb(this.value);
  }

  get luma() {
    const [r, g, b] = this.value;
    return Math.sqrt(0.241 * r + 0.691 * g + 0.068 * b);
  }

  get css() {
    if (this.value[3] === undefined || this.value[3] === 1) {
      return colorString.to.hex(this.value);
    }

    return this.rgb;
  }
}

export default {
  white: new Color('#ffffff'),
  black: new Color('#090808'),
  accent: new Color('#884aff'),
  shades: {
    s100: new Color('#C1C1C1'),
    s200: new Color('#AFAFAF'),
    s300: new Color('#505050'),
    s400: new Color('#3C3C3C'),
    s500: new Color('#212121'),
    s600: new Color('#191919'),
    s700: new Color('#0A0A0A'),
    s800: new Color('#080808'),
  },
};
