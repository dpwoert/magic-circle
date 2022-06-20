import { useState, useEffect } from 'react';
import Store from './store';

export default function useStore<T>(store: Store<T>): T {
  const [value, setValue] = useState<T>(store.value);

  useEffect(() => {
    const listener = (newValue: T) => {
      setValue(newValue);
    };

    // Listen to updates
    store.onChange(listener);

    // make sure we're in sync if changing stores
    if (value !== store.value) {
      setValue(store.value);
    }

    return () => {
      store.removeListener(listener);
    };
  }, [store, value]);

  return value;
}
