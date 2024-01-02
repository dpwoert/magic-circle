/* eslint-disable no-underscore-dangle */
import Store from './store';

export default class StoreFamily<T> {
  read?: (id: string) => T;
  cache: Record<string, Store<T>> = {};
  private _keys: string[] = [];

  constructor() {
    this.reset();
  }

  set(fn: (id: string) => T) {
    this.read = fn;

    // ensure all values are updated
    Object.keys(this.cache).forEach((key) => {
      this.cache[key].set(fn(key));
    });

    return this;
  }

  get(id: string) {
    if (!id) {
      return new Store(null);
    }

    // create store when needed
    if (!this.cache[id] && this.read) {
      const data = this.read(id);
      const store = new Store<T>(data);
      this.cache[id] = store;
    }

    // Add to list of keys
    if (!this._keys.includes(id)) {
      this._keys.push(id);
    }

    return this.cache[id] || null;
  }

  export(fn: (key: string, value: T) => void) {
    this._keys.forEach((key) => {
      const result = this.get(key);
      if (result && result.value) fn(key, result.value);
    });
  }

  keys(keys: string[]) {
    this._keys = keys;
  }

  reset() {
    this.cache = {};
    this._keys = [];
  }
}
