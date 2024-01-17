import type MagicCircle from './client';
import type Control from './control';
import Paths from './paths';

export type Child = Layer | Control<any>;

export type LayerIcon =
  | 'layer'
  | 'group'
  | 'mesh'
  | 'material'
  | 'light'
  | 'camera'
  | 'scene'
  | 'bone'
  | 'plugin'
  | 'file'
  | 'folder'
  | 'sound'
  | 'code'
  | 'computation'
  | 'renderer';

type JSONOutput = {
  path: string;
  name: string;
  folder: boolean;
  children: Array<JSONOutput | ReturnType<Control<any>['toJSON']>>;
  collapse: boolean;
  icon?: LayerIcon;
};

export default class Layer {
  name: string;
  children: Child[];
  parent?: Layer;
  magicInstance?: MagicCircle;
  folder: boolean;
  collapsed: boolean;
  isBaseLayer: boolean;
  customIcon?: LayerIcon;

  /**
   * @param name Name of layer
   * @param magicInstance Only used when created as root layer
   */
  constructor(name: string, magicInstance?: MagicCircle) {
    this.name = name;
    this.children = [];
    this.folder = false;
    this.collapsed = false;
    this.isBaseLayer = !!magicInstance;
    this.magicInstance = magicInstance;
  }

  /**
   * Sets the type of layer, giving it a correct icon in the sidebar
   *
   * @param string Type of layer
   */
  icon(icon: LayerIcon) {
    this.customIcon = icon;
    return this;
  }

  /**
   * Loop through all direct children.
   * Does not work recursively.
   *
   * @param hook Function that has child as argument
   */
  forEach(fn: (child: Child) => void) {
    this.children.forEach((child) => {
      fn(child);
    });
  }

  /** @deprecated */
  forEachRecursive(fn: (child: Child, path: string) => void) {
    console.warn('Deprecated: use .traverse');
    this.traverse(fn);
  }

  /**
   * Loop through all children recursively.
   *
   * @param hook Function that has child and path as arguments
   */
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

  /**
   * Loop through all parents recursively.
   *
   * @param hook Function that has parent as argument
   */
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

  /**
   * Gets Magic Istance this layer is connected to
   */
  getMagicInstance() {
    let instance: MagicCircle | undefined;

    this.traverseAncestors((layer) => {
      if (layer.isBaseLayer) {
        instance = layer.magicInstance;
      }
    });

    return instance;
  }

  /**
   * Adds one or more children to this layer
   *
   * @param layer Child(ren) to add to this layer
   */
  add(child: Child | Child[]) {
    /* eslint-disable no-param-reassign */
    if (Array.isArray(child)) {
      // Add one by one
      child.forEach((c) => {
        this.children.push(c);
        c.parent = this;
      });
    } else if (this.children.indexOf(child) === -1) {
      // Make sure we're not duplicating
      this.children.push(child);
      child.parent = this;
    }
    /* eslint-enable no-param-reassign */

    // ensure we're syncing magic instance after
    const mc = this.getMagicInstance();
    if (mc) {
      mc.sync();
    }

    return this;
  }

  /**
   * Add this layer as child to another layer
   *
   * @param layer Layer/folder to add to
   */
  addTo(layer: Layer) {
    if (this.parent) {
      this.removeFromParent();
    }

    layer.add(this);
    this.parent = layer;

    return this;
  }

  /**
   * Remove one of more children from this layer
   *
   * @param layer Layer(s) to remove
   */
  remove(layer: Child | Child[]) {
    this.children = this.children.filter((c) =>
      Array.isArray(layer) ? !layer.includes(c) : c !== layer
    );

    return this;
  }

  /**
   * Removes this control from parent
   */
  removeFromParent() {
    if (this.parent) {
      this.parent.remove(this);
      this.parent = undefined;
    }
  }

  /**
   * Destroys this instance and all memory associated with it
   *
   * @param removeChildren Removes and destroys all children when true
   */
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

  /**
   * Collapse list of children in UI
   *
   * @param collapsed Set collapsed to true/false
   */
  collapse(collapsed = true) {
    this.collapsed = collapsed;
    return this;
  }

  /**
   * Get path in tree
   *
   * @param basePath Base path to prepend
   * @param paths Reference to all paths to prevent duplicates
   */
  getPath(basePath: string, paths: Paths) {
    return paths.get(basePath, this.name);
  }

  /**
   * Exports settings to JSON
   *
   * @param basePath Base path to prepend
   * @param paths Reference to all paths to prevent duplicates
   */
  toJSON(basePath: string, paths: Paths): JSONOutput {
    const path = this.getPath(basePath, paths);
    const startPath = this.isBaseLayer ? '' : path;
    return {
      path,
      name: this.name,
      folder: this.folder,
      icon: this.customIcon,
      children: this.children.map((child) => child.toJSON(startPath, paths)),
      collapse: this.collapsed,
    };
  }
}
