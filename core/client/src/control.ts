import type Layer from './layer';
import type Paths from './paths';

type Reference = Record<string, any>;

type UpdateHook<T> = (newValue: T) => void;

type options = Record<string, unknown>;

export default class Control<T, U extends options = options> {
  type: string;
  reference: Reference;
  key: string;
  initialValue: T;
  options: { label: string } & Partial<U>;
  blockHydrate?: boolean;
  blockObjectMerge?: boolean;
  watchChanges?: boolean;
  parent?: Layer;

  private updateHooks: Set<UpdateHook<T>>;

  constructor(reference: Reference, key: string) {
    if (!reference) {
      throw new Error('Reference object does not exist');
    }
    if (reference[key] === undefined) {
      throw new Error(`Key (${key}) does not exist on referenced object`);
    }

    this.reference = reference;
    this.key = key;
    this.updateHooks = new Set();

    this.options = {
      label: key,
    } as Control<T, U>['options'];

    this.setDefault();
  }

  get value(): T {
    return this.reference[this.key];
  }

  set value(value: T) {
    if (value === null || value === undefined) {
      console.warn('Trying to set null or undefined value to a control');
    } else if (typeof value === 'object' && !this.blockObjectMerge) {
      // set objects per key, so to not destroy references
      Object.keys(value).forEach((k) => {
        this.reference[this.key][k] = value[k];
      });
    } else {
      this.reference[this.key] = value;
    }

    // Run update hooks
    this.updateHooks.forEach((fn) => fn(value));
  }

  label(label: string) {
    this.options.label = label;
    return this;
  }

  reset() {
    this.value = this.initialValue;
  }

  setDefault() {
    if (this.value === undefined) {
      this.initialValue = undefined;
    } else if (this.value === null) {
      this.initialValue = null;
    } else if (Array.isArray(this.value)) {
      // @ts-ignore
      this.initialValue = [...this.value];
    } else if (typeof this.value === 'object') {
      // @ts-ignore
      this.initialValue = {};
      Object.keys(this.value).forEach((k) => {
        this.initialValue[k] = this.value[k];
      });
    } else {
      this.initialValue = this.value;
    }
  }

  getPath(basePath: string, paths: Paths) {
    return paths.get(basePath, this.key);
  }

  watch(watch = true) {
    this.watchChanges = watch;
    return this;
  }

  // eslint-disable-next-line
  interpolate(from: T, to: T, alpha: number) {
    return from;
  }

  onUpdate(fn: UpdateHook<T>) {
    this.updateHooks.add(fn);
    return this;
  }

  addTo(layer: Layer) {
    if (this.parent) {
      this.removeFromParent();
    }

    this.parent = null;
    layer.add(this);

    return this;
  }

  sync() {
    if (this.parent) {
      this.parent.getMagicInstance().sync();
    }
  }

  toJSON(basePath: string, paths: Paths) {
    const path = this.getPath(basePath, paths);
    return {
      path,
      label: this.options.label || this.key,
      options: this.options,
      type: this.type,
      value: this.value,
      initialValue: this.initialValue,
      blockHydrate: !!this.blockHydrate,
      watching: !!this.watchChanges,
    };
  }

  removeFromParent() {
    if (this.parent) {
      this.parent.remove(this);
      this.parent = null;
    }
  }

  destroy() {
    if (this.parent) {
      this.removeFromParent();
    }

    this.reference = null;
    this.updateHooks.clear();
  }
}
