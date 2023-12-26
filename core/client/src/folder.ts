import Layer from './layer';

export default class Folder extends Layer {
  constructor(name: string, children?: Parameters<Layer['add']>[0]) {
    super(name);
    this.folder = true;
    this.add(children || []);
  }
}
