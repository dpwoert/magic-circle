import { Store as StoreClass } from '@magic-circle/schema';

type Hook<T> = (newValue: T) => void;

export default class Store<T> implements StoreClass<T> {
  value: T;
  hooks: Hook<T>[];

  constructor(initialValue: T) {
    this.value = initialValue;
    this.hooks = [];
  }

  set(value: T) {
    this.value = value;

    // run all hooks
    this.hooks.forEach((h) => h(value));
  }

  onChange(hook: Hook<T>) {
    this.hooks.push(hook);
  }

  removeListener(hook: Hook<T>) {
    this.hooks = this.hooks.filter((t) => t !== hook);
  }
}
