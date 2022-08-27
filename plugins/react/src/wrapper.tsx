import React, { useContext, useState, useEffect, useRef } from 'react';
import { Control } from '@magic-circle/client';

import { ClientContext, ParentContext } from './Contexts';
import useSync from './useSync';

type withDefaultProps<T> = { label?: string; watch?: boolean } & T;

type allProps<T, V> = {
  value: V;
  onUpdate: (newValue: V) => void;
} & withDefaultProps<T>;

const createWrapper = <V, C extends Control<V>, T>(
  constr: typeof Control<V>,
  mapping: (instance: C, props: withDefaultProps<T>) => void
) => {
  return ({ value, onUpdate, ...props }: allProps<T, V>) => {
    const reference = useRef<V>(value);
    const client = useContext(ClientContext);
    const [instance] = useState<C>(
      () => new constr(reference, 'current').onUpdate(onUpdate) as C
    );
    useSync(instance);

    useEffect(() => {
      mapping(instance, props as withDefaultProps<T>);

      if (client) client.sync();
    }, [instance, client, props]);

    useEffect(() => {
      reference.current = value;
      if (client) client.sync();
    }, [client, value]);

    return null;
  };
};

export default createWrapper;
