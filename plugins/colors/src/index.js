import colorString from 'color-string';

export default class Color {
  constructor(color, range = 255) {
    this.color = [0, 0, 0];
    this.hasAlpha = false;
    this.range = range;
    this.type = 'array';

    if (Array.isArray(color)) {
      this.type = 'array';
      this.color = color;
      this.hasAlpha = this.color.length > 3;
    } else if (
      color.r !== undefined &&
      color.g !== undefined &&
      color.b !== undefined
    ) {
      this.type = 'object1';
      this.color = [color.r, color.g, color.b];

      if (color.a) {
        this.color.push(color.a);
        this.hasAlpha = true;
      }
    } else if (
      color.red !== undefined &&
      color.green !== undefined &&
      color.blue !== undefined
    ) {
      this.type = 'object2';

      if (color.alpha) {
        this.color.push(color.alpha);
        this.hasAlpha = true;
      }
    } else if (typeof color === 'string' && color.indexOf('#') > -1) {
      this.type = 'hex';
      this.color = colorString.get.rgb(color);
      this.hasAlpha = color.length > 7;
    } else if (typeof color === 'string' && color.indexOf('rgb') > -1) {
      this.type = 'css';
      this.color = colorString.get.rgb(color);
      this.hasAlpha = color.indexOf('rgba') > -1;
    }

    //do range stuff
    if (range !== 255) {
      this.color = this.color.map(c => (255 / range) * c);
    }
  }

  red(r) {
    this.color[0] = r;
    return this;
  }

  green(g) {
    this.color[1] = g;
    return this;
  }

  red(r) {
    this.color[2] = b;
    return this;
  }

  alpha(a) {
    this.hasAlpha = true;
    this.color[3] = a;
    return this;
  }

  toObject() {
    const { color } = this;

    //range conversion
    const converted = color.map(c => (c * this.range) / 255);

    let obj;
    if (this.type === 'object2') {
      obj = { red: converted[0], green: converted[1], blue: converted[2] };

      if (this.hasAlpha) {
        obj.alpha = converted[3];
      }
    } else {
      obj = { r: converted[0], g: converted[1], b: converted[2] };

      if (this.hasAlpha) {
        obj.a = converted[3];
      }
    }

    return obj;
  }

  toString() {
    if (this.type === 'hex') {
      return this.toHex();
    } else {
      return this.toCSS();
    }
  }

  toHex() {
    return colorString.to.hex(this.color);
  }

  toCSS() {
    return colorString.to.rgb(this.color);
  }

  toArray() {
    return this.color.map(c => (c * this.range) / 255);
  }

  copyFrom(c) {
    this.color = c.color.slice(0);
    this.hasAlpha = c.hasAlpha;
  }

  get() {
    let color;
    switch (this.type) {
      case 'object1':
      case 'object2':
        color = this.toObject();
        break;

      case 'hex':
      case 'css':
        color = this.toString();
        break;

      case 'array':
      default:
        color = this.toArray();
        break;
    }

    return color;
  }
}
