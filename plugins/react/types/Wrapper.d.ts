import { Control } from '@magic-circle/client';
declare type withDefaultProps<T> = {
  label?: string;
  watch?: boolean;
} & T;
declare type allProps<T> = {
  reference: Record<string, any>;
  key: string;
} & withDefaultProps<T>;
declare const createWrapper: <V, C extends Control<V>, T>(
  constr: {
    new (
      reference: {
        [x: string]: any;
      },
      key: string
    ): Control<V>;
  },
  mapping: (instance: C, props: withDefaultProps<T>) => void
) => ({ reference, key, ...props }: allProps<T>) => any;
export default createWrapper;
