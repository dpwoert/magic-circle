import Layer from './layer';

export default class Folder extends Layer {
  constructor(name: string, children?: Layer['children']) {
    super(name);
    this.folder = true;
    this.add(children || []);
  }
}
