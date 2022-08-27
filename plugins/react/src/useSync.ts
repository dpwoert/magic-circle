import React, { useContext, useState, useEffect, useRef } from 'react';
import { Folder as FolderMC } from '@magic-circle/client';

import { ClientContext, ParentContext } from './Contexts';

type Child = Parameters<FolderMC['add']>[0];

export default function useSync(instance: Child) {
  const client = useContext(ClientContext);
  const parent = useContext(ParentContext);

  const myParent = useRef<typeof parent>();

  console.log({ client });

  useEffect(() => {
    if (!client) {
      return;
    }

    if (myParent.current !== parent) {
      if (myParent.current) {
        myParent.current.remove(instance);
      }

      parent.add(instance);
      myParent.current = parent;
      client.sync();
    }
  }, [parent]);

  useEffect(() => {
    return () => {
      parent.remove(instance);
      client.sync();
    };
  }, []);
}
