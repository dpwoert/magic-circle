import { useState, useEffect } from 'react';
import StoreFamily from './storeFamily';

export default function useStoreFamily<T>(
  storeFamily: StoreFamily<T>,
  key: string
): T | null {
  const [value, setValue] = useState<T | null>(
    () => storeFamily.get(key)?.value || null
  );

  useEffect(() => {
    const listener = (newValue: T | null) => {
      setValue(newValue);
    };

    // Listen to updates
    const store = storeFamily.get(key);
    store.onChange(listener);

    // make sure we're in sync if changing stores
    if (value !== store.value) {
      setValue(store.value);
    }

    return () => {
      store.removeListener(listener);
    };
  }, [storeFamily, key, value]);

  return value;
}
