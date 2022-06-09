import type {
  App as AppBase,
  Plugin,
  Config,
  UserConfig,
  ButtonCollections,
  SidebarOpts,
  Sidebar,
  PageInfo,
} from '@magic-circle/schema';
import { IpcIframe, IpcBase } from '@magic-circle/client';
import { Store } from '@magic-circle/state';

import defaultConfig from './default-config';
import userConfig from './user-config';

class App implements AppBase {
  plugins: Plugin[];
  config: Config;
  ipc: IpcBase;

  sidebar: Store<Sidebar>;
  buttons: Store<ButtonCollections>;
  pageInfo: Store<PageInfo>;

  constructor(userConf: UserConfig) {
    // merge with default config
    this.config = { ...defaultConfig, ...userConf };

    // Setup ipc
    this.ipc = new IpcIframe();

    // Set initial values
    this.plugins = [];
    this.buttons = new Store<ButtonCollections>({});
    this.sidebar = new Store<Sidebar>({ current: 0, panels: [] });
    this.pageInfo = new Store<PageInfo>({ title: 'No title' });
  }

  async connect() {
    this.ipc.setup();
    await this.ipc.connect();

    const sidebar: SidebarOpts[] = [];
    let buttons: ButtonCollections = {};

    // Load all plugins
    await Promise.all(
      this.config.plugins.map(async (P) => {
        const plugin = new P();

        await plugin.setup(this);

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
      })
    );

    // store data in effects
    this.buttons.set(buttons);
    this.sidebar.set({ ...this.sidebar.value, panels: sidebar });

    // ready now
    this.plugins.forEach((p) => {
      if (p.ready) p.ready();
    });

    // Update page information when needed
    this.ipc.on('page-information', (info:PageInfo) => {
      this.pageInfo.set(info)
    })
  }

  getPlugin(name: string) {
    return this.plugins.find((p) => p.name === name);
  }

  getSetting(name: string) {}
}

const app = new App(userConfig);
export default app;
