import type Control from './control';
import Paths from './paths';

export type Child = Layer | Control<any>;

export default class Layer {
  name: string;
  children: Child[];
  folder: boolean;
  collapsed: boolean;

  constructor(name: string) {
    this.name = name;
    this.children = [];
    this.folder = false;
    this.collapsed = false;
  }

  forEach(fn: (child: Child) => void) {
    this.children.forEach((child) => {
      fn(child);
    });
  }

  forEachRecursive(fn: (child: Child, path: string) => void) {
    const path = new Paths();

    const recursive = (children: Child[], basePath: string) => {
      children.forEach((child) => {
        const currentPath = child.getPath(basePath, path);
        fn(child, currentPath);

        if ('children' in child) {
          recursive(child.children, currentPath);
        }
      });
    };

    recursive(this.children, this.name);
  }

  add(child: Child | Child[]) {
    if (Array.isArray(child)) {
      // Add one by one
      child.forEach((c) => {
        this.add(c);
      });
    } else if (this.children.indexOf(child) === -1) {
      // Make sure we're not duplicating
      this.children.push(child);
    }

    return this;
  }

  addTo(layer: Layer) {
    layer.add(this);

    return this;
  }

  remove(layer: Child | Child[]) {
    this.children = this.children.filter((c) =>
      Array.isArray(layer) ? !layer.includes(c) : c !== layer
    );

    return this;
  }

  collapse(collapsed = true) {
    this.collapsed = collapsed;
    return this;
  }

  getPath(basePath: string, paths: Paths) {
    return paths.get(basePath, this.name);
  }

  toJSON(basePath: string, paths: Paths) {
    const path = this.getPath(basePath, paths);
    return {
      path,
      name: this.name,
      folder: this.folder,
      children: this.children.map((child) => child.toJSON(path, paths)),
      collapse: this.collapsed,
    };
  }
}
