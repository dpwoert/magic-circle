import React, { useRef, useState } from 'react';
import { MagicCircle } from '@magic-circle/client';

import { ClientContext, LoopContext, ParentContext } from './Contexts';

type ClientProps = {
  setup?: Parameters<MagicCircle['setup']>[0];
  autoPlay?: boolean;
  children: React.ReactNode;
};

export const Client = ({ setup, autoPlay = true, children }: ClientProps) => {
  const loopRef = useRef<Parameters<MagicCircle['loop']>[0][]>([]);

  const [instance] = useState<MagicCircle>(() => {
    const magic = new MagicCircle().setup(setup).loop((delta) => {
      loopRef.current.forEach((fn) => fn(delta));
    });

    if (autoPlay) {
      magic.start();
    }

    return magic;
  });

  return (
    <ClientContext.Provider value={instance}>
      <LoopContext.Provider value={loopRef.current}>
        <ParentContext.Provider value={instance.layer}>
          {children}
        </ParentContext.Provider>
      </LoopContext.Provider>
    </ClientContext.Provider>
  );
};
