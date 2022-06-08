import type {
  App as AppBase,
  Plugin,
  Config,
  UserConfig,
  ButtonCollections,
} from '@magic-circle/schema';
import Store from './store'

import defaultConfig from './default-config';
import userConfig from './user-config';

class App implements AppBase {
  plugins: Plugin[];
  config: Config;
  buttons: Store<ButtonCollections>;

  constructor(userConf: UserConfig) {
    // merge with default config
    this.config = { ...defaultConfig, ...userConf };

    // Set initial values
    this.plugins = [];
    let buttons = {};

    this.config.plugins.forEach(P => {
      const plugin = new P();

      // load plugins
      this.plugins.push(plugin);

      // Set buttons
      if (plugin.buttons) {
        buttons = plugin.buttons(buttons);
      }
    });

    // store buttons in an effect
    this.buttons = new Store<ButtonCollections>(buttons);
    
    console.log(this)
  }

  getPlugin(name: string) {
    return this.plugins.find(p => p.name === name);
  }

  getSetting(name: string) {}
}

const app = new App(userConfig);
export default app;
