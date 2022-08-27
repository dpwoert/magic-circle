import React, { useContext, useState, useEffect } from 'react';
import { Folder as FolderMC } from '@magic-circle/client';

import { ClientContext, ParentContext } from './Contexts';
import useSync from './useSync';

type ClientProps = {
  name: string;
  children: React.ReactNode;
};

export const Folder = ({ name, children }: ClientProps) => {
  const client = useContext(ClientContext);
  const parent = useContext(ParentContext);
  const [folder] = useState<FolderMC>(new FolderMC(name).addTo(parent));
  useSync(folder);

  useEffect(() => {
    if (client) {
      client.sync();
    }
  }, [name]);

  return (
    <ParentContext.Provider value={folder}>{children}</ParentContext.Provider>
  );
};
