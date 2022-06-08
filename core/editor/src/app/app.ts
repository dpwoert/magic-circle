import type {
  App as AppBase,
  Plugin,
  Config,
  UserConfig,
  ButtonCollections,
  SidebarOpts,
} from '@magic-circle/schema';
import Store from './store';

import defaultConfig from './default-config';
import userConfig from './user-config';

class App implements AppBase {
  plugins: Plugin[];
  sidebar: Store<SidebarOpts[]>;
  config: Config;
  buttons: Store<ButtonCollections>;

  constructor(userConf: UserConfig) {
    // merge with default config
    this.config = { ...defaultConfig, ...userConf };

    // Set initial values
    this.plugins = [];
    const sidebar: SidebarOpts[] = [];
    let buttons: ButtonCollections = {};

    this.config.plugins.forEach((P) => {
      const plugin = new P();

      // load plugins
      this.plugins.push(plugin);

      // Set buttons
      if (plugin.buttons) {
        buttons = plugin.buttons(buttons);
      }

      // set sidebar
      if (plugin.sidebar) {
        sidebar.push(plugin.sidebar());
      }
    });

    // store data in effects
    this.buttons = new Store<ButtonCollections>(buttons);
    this.sidebar = new Store<SidebarOpts[]>(sidebar);
  }

  getPlugin(name: string) {
    return this.plugins.find((p) => p.name === name);
  }

  getSetting(name: string) {}
}

const app = new App(userConfig);
export default app;
