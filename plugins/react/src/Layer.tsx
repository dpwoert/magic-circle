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
  const [layer] = useState<LayerMC>(new LayerMC(name));
  useSync(layer);

  useEffect(() => {
    layer.name = name;
    if (client) {
      client.sync();
    }
  }, [name, client, layer]);

  return (
    <ParentContext.Provider value={layer}>{children}</ParentContext.Provider>
  );
};
