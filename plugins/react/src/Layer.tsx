import React, { useContext, useState, useEffect } from 'react';
import { Layer as LayerMC } from '@magic-circle/client';

import { ClientContext, ParentContext } from './Contexts';
import useSync from './useSync';

type ClientProps = {
  name: string;
  children: React.ReactNode;
};

export const Layer = ({ name, children }: ClientProps) => {
  const client = useContext(ClientContext);
  const [folder] = useState<LayerMC>(new LayerMC(name));
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
