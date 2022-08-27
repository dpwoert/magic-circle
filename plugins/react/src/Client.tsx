import React, { useContext, useState } from 'react';
import { MagicCircle } from '@magic-circle/client';

import { ClientContext, ParentContext } from './Contexts';

type ClientProps = {
  setup?: Parameters<MagicCircle['setup']>[0];
  loop?: Parameters<MagicCircle['loop']>[0];
  children: React.ReactNode;
};

export const Client = ({ setup, loop, children }: ClientProps) => {
  const [instance] = useState<MagicCircle>(() => {
    return new MagicCircle().setup(setup).loop(loop);
  });

  return (
    <ClientContext.Provider value={instance}>
      <ParentContext.Provider value={instance.layer}>
        {children}
      </ParentContext.Provider>
    </ClientContext.Provider>
  );
};
