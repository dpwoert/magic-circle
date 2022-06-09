import { useState, useEffect } from 'react';
import Store from './store';

export default function useStore<T>(store: Store<T>): T {
  const [value, setValue] = useState<T>(store.value);

  useEffect(() => {
    const listener = (newValue: T) => {
      setValue(newValue);
    };

    store.onChange(listener);

    return () => {
      store.removeListener(listener);
    };
  }, [store]);

  return value;
}
