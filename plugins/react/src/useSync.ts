import { useContext, useEffect, useRef } from 'react';
import { Folder as FolderMC } from '@magic-circle/client';

import { ClientContext, ParentContext } from './Contexts';

type Child = Parameters<FolderMC['add']>[0];

export default function useSync(instance: Child) {
  const client = useContext(ClientContext);
  const parent = useContext(ParentContext);

  const myParent = useRef<typeof parent>();

  useEffect(() => {
    if (!client) {
      return;
    }

    if (myParent.current !== parent) {
      if (myParent.current) {
        myParent.current.remove(instance);
      }

      if (parent) parent.add(instance);
      myParent.current = parent;
      client.sync();
    }
  }, [parent, client, instance]);

  useEffect(() => {
    return () => {
      myParent.current?.remove(instance);
      if (client) client.sync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
