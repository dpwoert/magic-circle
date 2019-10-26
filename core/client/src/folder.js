import { Layer } from './layer';

export class Folder extends Layer {
  constructor(...args) {
    super(...args);
    this.isLayer = false;
    this.isFolder = true;
    this.children = null;
  }

  forEach(fn) {
    this.controls.forEach(control => fn(control));
  }
}

// Prevents circular reference when importing
Layer.__Folder = Folder; //eslint-disable-line
