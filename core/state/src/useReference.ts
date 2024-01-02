import { useContext, useEffect } from 'react';

import { CommandLineReference } from '@magic-circle/schema';

import { AppContext } from './AppProvider';

export default function useReference(reference: CommandLineReference) {
  const app = useContext(AppContext);

  useEffect(() => {
    if (app) app.commandLineReference.set(reference);

    return () => {
      if (app) app.commandLineReference.set(null);
    };
  }, [app, reference]);
}
