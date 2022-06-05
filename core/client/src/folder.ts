import Layer from './layer';

export default class Folder extends Layer {
  constructor(name: string) {
    super(name);
    this.folder = true;
  }
}
