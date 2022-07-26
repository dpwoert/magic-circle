import type Paths from './paths';

type Reference = Record<string, any>;

export default class Control<T> {
  type: string;
  reference: Reference;
  key: string;
  initialValue: T;
  options: Record<string, unknown>;
  blockHydrate?: boolean;
  watchChanges?: boolean;

  constructor(reference: Reference, key: string) {
    if (!reference) {
      throw new Error('Reference object does not exist');
    }
    if (reference[key] === undefined) {
      throw new Error(`Key (${key}) does not exist on referenced object`);
    }

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
    if (value === null || value === undefined) {
      console.warn('Trying to set null or undefined value to a control');
    } else if (typeof value === 'object') {
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
}
