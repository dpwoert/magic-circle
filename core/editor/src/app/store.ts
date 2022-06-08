import type { Store as StoreSchema } from '@magic-circle/schema';
import { AtomEffect } from 'recoil';

type Hook<T> = (newValue: T) => void;

export default class Store<T> implements StoreSchema<T> {
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

  effect(): AtomEffect<T> {
    return ({ setSelf, trigger }) => {
      // get value from storagre
      if (trigger === 'get') {
        setSelf(this.value);
      }

      const update = (newValue: T) => {
        setSelf(newValue);
      };

      this.onChange(update);

      return () => {
        this.removeListener(update);
      };
    };
  }
}
