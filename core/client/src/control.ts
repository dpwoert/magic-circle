import type Paths from './paths';

type Reference = Record<string, any>;

export default class Control<T> {
  type: string;
  reference: Reference;
  key: string;
  initialValue: T;
  options: Record<string, unknown>;
  blockHydrate?: boolean;

  constructor(reference: Reference, key: string) {
    this.reference = reference;
    this.key = key;

    this.options = {
      label: key,
    };

    this.setDefault();
  }

  get value(): T {
    return this.reference[this.key];
  }

  set value(value: T) {
    if (typeof value === 'object') {
      // set objects per key, so to not destroy references
      Object.keys(value).forEach((k) => {
        this.reference[this.key][k] = value[k];
      });
    } else {
      this.reference[this.key] = value;
    }
  }

  label(label: string) {
    this.options.label = label;
    return this;
  }

  reset() {
    this.value = this.initialValue;
  }

  setDefault() {
    this.initialValue = this.value;
  }

  getPath(basePath: string, paths: Paths) {
    return paths.get(basePath, this.key);
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
    };
  }
}
