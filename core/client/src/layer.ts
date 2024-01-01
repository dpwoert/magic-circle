import type MagicCircle from './client';
import type Control from './control';
import Paths from './paths';

export type Child = Layer | Control<any>;

export default class Layer {
  name: string;
  children: Child[];
  parent?: Layer;
  magicInstance?: MagicCircle;
  folder: boolean;
  collapsed: boolean;
  isBaseLayer: boolean;

  constructor(name: string, magicInstance?: MagicCircle) {
    this.name = name;
    this.children = [];
    this.folder = false;
    this.collapsed = false;
    this.isBaseLayer = !!magicInstance;
    this.magicInstance = magicInstance;
  }

  forEach(fn: (child: Child) => void) {
    this.children.forEach((child) => {
      fn(child);
    });
  }

  forEachRecursive(fn: (child: Child, path: string) => void) {
    console.warn('Deprecated: use .traverse');
    this.traverse(fn);
  }

  traverse(fn: (child: Child, path: string) => void) {
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

    recursive(this.children, this.isBaseLayer ? '' : this.name);
  }

  traverseAncestors(fn: (parent: Layer) => void) {
    const recursive = (parent: Layer) => {
      fn(parent);

      // move upwards
      if (parent.parent) {
        recursive(parent.parent);
      }
    };

    if (this.parent) {
      recursive(this.parent);
    }
  }

  getMagicInstance() {
    let instance: MagicCircle | undefined;

    this.traverseAncestors((layer) => {
      if (layer.isBaseLayer) {
        instance = layer.magicInstance;
      }
    });

    return instance;
  }

  add(child: Child | Child[]) {
    if (Array.isArray(child)) {
      // Add one by one
      child.forEach((c) => {
        this.children.push(c);
      });
    } else if (this.children.indexOf(child) === -1) {
      // Make sure we're not duplicating
      this.children.push(child);
    }

    // ensure we're syncing magic instance after
    const mc = this.getMagicInstance();
    if (mc) {
      mc.sync();
    }

    return this;
  }

  addTo(layer: Layer) {
    if (this.parent) {
      this.removeFromParent();
    }

    layer.add(this);
    this.parent = layer;

    return this;
  }

  remove(layer: Child | Child[]) {
    this.children = this.children.filter((c) =>
      Array.isArray(layer) ? !layer.includes(c) : c !== layer
    );

    return this;
  }

  removeFromParent() {
    if (this.parent) {
      this.parent.remove(this);
      this.parent = undefined;
    }
  }

  destroy(removeChildren = false) {
    if (this.parent) {
      this.removeFromParent();
    }

    // remove all children if needed
    if (removeChildren) {
      this.traverse((child) => {
        child.destroy();
      });
    }

    this.children = [];
    this.magicInstance = undefined;
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
    const startPath = this.isBaseLayer ? '' : path;
    return {
      path,
      name: this.name,
      folder: this.folder,
      children: this.children.map((child) => child.toJSON(startPath, paths)),
      collapse: this.collapsed,
    };
  }
}
