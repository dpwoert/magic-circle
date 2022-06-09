import { nanoid } from 'nanoid';

import type Control from './control';

type Child = Layer | Control<any>;

export default class Layer {
  id: string;
  name: string;
  children: Child[];
  folder: boolean;

  constructor(name: string) {
    this.id = nanoid();
    this.name = name;
    this.children = [];
    this.folder = false;
  }

  forEach(fn: (child: Child) => void) {
    this.children.forEach((child) => {
      fn(child);
    });
  }

  forEachRecursive(fn: (child: Child) => void) {
    // todo
    const recursive = (children: Child[]) => {
      children.forEach((child) => {
        fn(child);

        if ('children' in child) {
          recursive(child.children);
        }
      });
    };

    recursive(this.children);
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

  find(id: string) {
    let found: Child;

    // recursively try to find this element
    const recursive = (children: Child[]) => {
      children.forEach((child) => {
        if (child.id === id) {
          found = child;
        }
        if ('children' in child && !found) {
          recursive(child.children);
        }
      });
    };

    // start
    recursive(this.children);
    return found;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      folder: this.folder,
      children: this.children.map((child) => child.toJSON()),
    };
  }
}
