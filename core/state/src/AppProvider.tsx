import { createContext } from 'react';

import { App } from '@magic-circle/schema';

export const AppContext = createContext<App>(null);

type AppProviderProps = {
  app: App;
  children: React.ReactNode;
};

const AppProvider = ({ children, app }: AppProviderProps) => {
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

export default AppProvider;
