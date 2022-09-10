import { useContext, useState, useEffect, useRef } from 'react';
import { Control } from '@magic-circle/client';

import { ClientContext } from './Contexts';
import useSync from './useSync';

type withDefaultProps<T> = { name: string } & T;

type allProps<T, V> = {
  value: V;
  onUpdate: (newValue: V) => void;
} & withDefaultProps<T>;

const createWrapper = <V, C extends Control<V>, T>(
  ControlConstructor: typeof Control<V>,
  mapping?: (instance: C, props: withDefaultProps<T>) => void
) => {
  return ({ value, onUpdate, ...props }: allProps<T, V>) => {
    const { name } = props;
    const reference = useRef<Record<string, V>>({ [name]: value });
    const client = useContext(ClientContext);
    const [instance] = useState<C>(
      () =>
        new ControlConstructor(reference.current, name).onUpdate(onUpdate) as C
    );
    useSync(instance);

    useEffect(() => {
      instance.label(props.name);
      if (mapping) mapping(instance, props as withDefaultProps<T>);

      if (client) client.sync();
    }, [instance, client, props]);

    useEffect(() => {
      reference.current = { [name]: value };
      if (client) client.sync();
    }, [client, value, name]);

    return null;
  };
};

export default createWrapper;
