import { useCallback, useState } from 'react';

type setStateFn<T> = (newValue: T) => void;

export default function usePermanentState<T>(
  key: string,
  defaultValue: T
): [T, setStateFn<T>] {
  const stored = localStorage.getItem(key);
  const startValue =
    stored === undefined || stored === null
      ? defaultValue
      : (JSON.parse(localStorage.getItem(key) || '') as T);
  const [state, setState] = useState<T>(startValue);

  const setStateProxy = useCallback(
    (newValue: T) => {
      setState(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  return [state, setStateProxy];
}
