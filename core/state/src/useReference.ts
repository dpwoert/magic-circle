import { useContext, useEffect } from 'react';

import { CommandLineReference } from '@magic-circle/schema';

import { AppContext } from './AppProvider';

export default function useReference(reference: CommandLineReference) {
  const app = useContext(AppContext);

  useEffect(() => {
    app.commandLineReference.set(reference);

    return () => {
      app.commandLineReference.set(null);
    };
  }, [app, reference]);
}
