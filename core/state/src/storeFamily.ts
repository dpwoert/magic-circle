import Store from './store';

export default class StoreFamily<T> {
  read: (id: string) => T;
  cache: Record<string, Store<T>>;
  _keys: string[];

  constructor() {
    this.cache = {};
    this._keys = [];
  }

  set(fn: (id: string) => T) {
    this.read = fn;

    // ensure all values are updated
    Object.keys(this.cache).forEach((key) => {
      this.cache[key].set(this.read(key));
    });

    return this;
  }

  get(id: string) {
    if (!id) {
      return new Store<T>(null);
    }

    // create store when needed
    if (!this.cache[id]) {
      const data = this.read(id);
      const store = new Store<T>(data);
      this.cache[id] = store;
    }

    // Add to list of keys
    if (!this._keys.includes(id)) {
      this._keys.push(id);
    }

    return this.cache[id];
  }

  export(fn: (key: string, value: T) => void) {
    console.log({ allkeys: this.keys });
    this._keys.forEach((key) => {
      fn(key, this.get(key).value);
    });
  }

  keys(keys: string[]) {
    this._keys = keys;
  }
}
