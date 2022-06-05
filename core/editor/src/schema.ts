import React from 'react';

export enum LayoutPlacement {
  SIDEBAR = 'sidebar',
}

export interface SidebarOpts {
  icon: string;
  render: () => React.ReactNode;
}

export type Hydration = Record<string, any>;

export interface Plugin {
  name: string;
  setup: (app: App) => Promise<void>;
  sidebar?: () => SidebarOpts;
  buttons?: (buttons: Buttons) => Promise<Buttons>;
  hydrate?: (hydration: Hydration) => Promise<Hydration>;
}

export interface Config {
  url: string;
  plugins: Plugin[];
  theme: {
    accent: string;
  };
  settings: {};
}

export type UserConfig = Partial<Config>;

export interface App {
  plugins: Plugin[];
  config: Config;
  getPlugin: (name: string) => Plugin;
  getSetting: (name: string) => unknown;
}

// build config file to JS file (resolve node) => copy to node folder => run next/parcel/CRA build
// for electron package, run by first building then launching electron with file
