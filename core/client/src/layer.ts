import type Control from './control';
import Paths from './paths';

type Child = Layer | Control<any>;

export default class Layer {
  name: string;
  children: Child[];
  folder: boolean;

  constructor(name: string) {
    this.name = name;
    this.children = [];
    this.folder = false;
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
      this.children.push(...child);
    } else {
      this.children.push(child);
    }

    return this;
  }

  addTo(layer: Layer) {
    layer.add(this);

    return this;
  }

  // find(id: string) {
  //   let found: Child;

  //   // recursively try to find this element
  //   const recursive = (children: Child[]) => {
  //     children.forEach((child) => {
  //       if (child.id === id) {
  //         found = child;
  //       }
  //       if ('children' in child && !found) {
  //         recursive(child.children);
  //       }
  //     });
  //   };

  //   // start
  //   recursive(this.children);
  //   return found;
  // }

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
    };
  }
}
