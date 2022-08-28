import { useContext, useEffect } from 'react';
import { MagicCircle } from '@magic-circle/client';

import { LoopContext } from './Contexts';

export default function useLoop(fn: Parameters<MagicCircle['loop']>[0]) {
  const loops = useContext(LoopContext);

  useEffect(() => {
    const current = fn;
    loops.push(current);

    return () => {
      const index = loops.indexOf(current);

      if (index > -1) {
        loops.splice(index, 1);
      }
    };
  }, [loops, fn]);
}
