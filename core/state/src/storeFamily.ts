import Store from './store';

export default class StoreFamily<T> {
  read: (id: string) => T;
  cache: Record<string, Store<T>>;

  constructor() {
    this.cache = {};
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
    // create store when needed
    if (!this.cache[id]) {
      const data = this.read(id);
      const store = new Store<T>(data);
      this.cache[id] = store;
    }

    return this.cache[id];
  }
}
