import React, { useContext, useState, useEffect } from 'react';
import { Layer as LayerMC } from '@magic-circle/client';

import { ClientContext, ParentContext } from './Contexts';
import useSync from './useSync';

type ClientProps = {
  name: string;
  children: React.ReactNode;
  icon?: LayerMC['customIcon'];
};

export const Layer = ({ name, children, icon }: ClientProps) => {
  const client = useContext(ClientContext);
  const [layer] = useState<LayerMC>(new LayerMC(name));
  useSync(layer);

  useEffect(() => {
    layer.name = name;
    layer.customIcon = icon;
    if (client) {
      client.sync();
    }
  }, [name, icon, client, layer]);

  return (
    <ParentContext.Provider value={layer}>{children}</ParentContext.Provider>
  );
};
