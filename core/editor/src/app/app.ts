import type { ReactNode } from 'react';
import Mousetrap from 'mousetrap';
import { getProperty } from 'dot-prop';
import deepMerge from 'deepmerge';

import type {
  App as AppBase,
  PluginBase,
  Config,
  UserConfig,
  ButtonCollections,
  SidebarOpts,
  Sidebar,
  PageInfo,
  layoutHooks,
  CommandLineScreen,
  CommandLineAction,
  CommandLineReference,
  LayoutHook,
  PluginConstructor,
  Control,
} from '@magic-circle/schema';
import { IpcIframe, IpcBase } from '@magic-circle/client';
import { Store } from '@magic-circle/state';

import defaultConfig from './default-config';
import userConfig from './user-config';

const getPlugins = async (
  plugins: Config['plugins'],
  defaultPlugins: PluginConstructor[]
): Promise<PluginConstructor[]> => {
  return typeof plugins === 'function' ? plugins(defaultPlugins) : plugins;
};

const getControls = async (
  controls: Config['controls'],
  defaultControls: Control<any, any>[]
): Promise<Control<any, any>[]> => {
  return typeof controls === 'function' ? controls(defaultControls) : controls;
};

class App implements AppBase {
  plugins: PluginBase[];
  controls: AppBase['controls'];
  config: Config;
  ipc: IpcBase;
  loaded: boolean;

  sidebar: Store<Sidebar>;
  buttons: Store<ButtonCollections>;
  commandLine: Store<CommandLineScreen | null>;
  commandLineReference: Store<CommandLineReference | null>;
  pageInfo: Store<PageInfo>;
  layoutHooks: Store<layoutHooks>;
  hasLoop: Store<boolean>;
  readyToConnect: Store<boolean>;

  constructor(userConf: UserConfig) {
    // merge with default config
    this.config = deepMerge<Config>(defaultConfig, userConf);

    // Setup ipc
    this.ipc = new IpcIframe();

    // Set initial values
    this.loaded = false;
    this.plugins = [];
    this.buttons = new Store<ButtonCollections>({});
    this.sidebar = new Store<Sidebar>({ current: 0, panels: [] });
    this.pageInfo = new Store<PageInfo>({ title: 'No title' });
    this.commandLine = new Store<CommandLineScreen | null>(null);
    this.commandLineReference = new Store<CommandLineReference | null>(null);
    this.layoutHooks = new Store<layoutHooks>({});
    this.hasLoop = new Store<boolean>(false);
    this.readyToConnect = new Store<boolean>(false);

    // Get controls
    this.controls = {};
  }

  async setup() {
    // Already done the editor setup, just need to reconnect
    if (this.loaded) {
      await this.connect();
      return;
    }

    // Create controls
    const defaultControls = await getControls(defaultConfig.controls, []);
    const controls = await getControls(defaultConfig.controls, defaultControls);
    controls.forEach((control) => {
      this.controls[control.name] = control;
    });

    this.ipc.setup();

    const sidebar: SidebarOpts[] = [];
    let buttons: ButtonCollections = {};

    // Get list of plugins
    const defaultPlugins = await getPlugins(defaultConfig.plugins, []);
    const plugins = await getPlugins(this.config.plugins, defaultPlugins);

    // Create all plugins
    plugins.forEach((Plugin) => {
      const plugin = new Plugin(this as unknown as AppBase);
      this.plugins.push(plugin);
    });

    // Load all plugins
    await Promise.all(
      this.plugins.map(async (plugin) => {
        await plugin.setup(this as unknown as AppBase);

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

    this.readyToConnect.set(true);

    await this.connect();

    // ready now
    this.plugins.forEach((p) => {
      if (p.ready) p.ready();
    });

    // Bind all shortcuts
    this.bindKeys();

    // Pretend setup hook from being re-run
    this.loaded = true;
  }

  async connect() {
    // Already connected
    if (this.ipc.isConnected) {
      return;
    }

    // remove redundant listeners
    this.ipc.removeAllListeners('hydrate');
    this.ipc.removeAllListeners('page-information');
    this.ipc.removeAllListeners('connect');
    this.ipc.removeAllListeners('disconnect');
    this.ipc.removeAllListeners('loop-set');

    // run hooks
    this.plugins.forEach((p) => {
      if (p.preConnect) p.preConnect();
    });

    await this.ipc.connect();

    // run hooks
    this.plugins.forEach((p) => {
      if (p.connect) p.connect();
    });

    // Update page information when needed
    this.ipc.on('page-information', (_, info: PageInfo) => {
      this.pageInfo.set(info);
      const pageTitle =
        this.config.settings.pageTitle || 'Magic Circle - {title}';
      document.title = pageTitle.replace('{title}', info.title);
    });

    // Do we have a loop?
    this.ipc.on('loop-set', (_, hasLoop: boolean) => {
      this.hasLoop.set(hasLoop);
    });

    // Reconnect if needed
    this.ipc.on('connect', () => {
      this.ipc.send('connect', true);
    });

    // Send hydration when needed
    this.ipc.on('hydrate', () => {
      const hydration: Record<string, any> = {};

      if (this.loaded) {
        this.plugins.forEach((p) => {
          if (p.hydrate) {
            hydration[p.name] = p.hydrate();
          }
        });
      }

      this.ipc.send('hydrate', hydration);
    });

    // Listen for disconnects
    this.ipc.once('disconnect', this.disconnect.bind(this));
  }

  async disconnect() {
    await this.reset();
    this.ipc.disconnect();
    this.connect();
  }

  async reset(sync = true) {
    await Promise.all(
      this.plugins.map(async (plugin) => {
        if (plugin.reset) await plugin.reset(sync);
      })
    );
  }

  async save() {
    const data: Record<string, any> = {};

    // Add meta data
    data.meta = {
      magicCircleVersion: process.env.MAGIC_CIRCLE_VERSION,
      projectName: this.config.projectName,
      url: this.config.url,
    };

    // Add data from plugins
    await Promise.all(
      this.plugins.map(async (plugin) => {
        if (plugin.save) {
          const toSave = await plugin.save();
          data[plugin.name] = toSave;
        }
      })
    );

    // Add git info
    if (process.env.GIT_COMMIT_SHA) {
      data.git = {
        sha: process.env.GIT_COMMIT_SHA,
        message: process.env.GIT_COMMIT_MESSAGE,
        branch: process.env.GIT_BRANCH,
      };
    }

    return data;
  }

  async load(data: Record<string, any>) {
    this.plugins.map(async (plugin) => {
      if (plugin.load && data[plugin.name]) {
        await plugin.load(data[plugin.name]);
      }
    });
  }

  getPlugin(name: string) {
    return this.plugins.find((p) => p.name === name);
  }

  getControl(name: string) {
    return this.controls[name];
  }

  getSetting<T>(path: string, defaultValue?: T): T {
    return getProperty(this.config.settings, path, defaultValue);
  }

  setLayoutHook(name: LayoutHook, value: ReactNode) {
    this.layoutHooks.set({
      ...this.layoutHooks.value,
      [name]: value,
    });
  }

  getCommandLine(reference?: CommandLineReference): CommandLineScreen {
    const items: CommandLineAction[] = [];
    const ref = reference || this.commandLineReference.value;

    // Get sidebar commands
    const sidebar: CommandLineAction[] = this.sidebar.value.panels.map(
      (panel, key) => ({
        icon: panel.icon,
        label: `Show ${panel.name} panel`,
        shortcut: `platform+${key + 1}`,
        onSelect: async () => {
          this.sidebar.set({
            ...this.sidebar.value,
            current: key,
          });
        },
      })
    );

    // Get pluggin commands
    this.plugins.forEach((p) => {
      if (p.commands) {
        items.push(...p.commands(ref || undefined));
      }
    });

    return {
      searchLabel: 'Type a command or search',
      initialScreen: true,
      reference: ref || undefined,
      actions: ref ? [...items] : [...sidebar, ...items],
    };
  }

  showCommandLine(screen?: CommandLineScreen) {
    if (screen) this.commandLine.set(screen);
    else this.commandLine.set(this.getCommandLine());
  }

  private bindKeys() {
    // Reset all shortcuts
    Mousetrap.reset();

    // Bind shortcuts
    this.getCommandLine().actions.forEach((action) => {
      if (action.shortcut) {
        const shortcut = action.shortcut.replace('platform', 'mod');

        Mousetrap.bind(shortcut, (e: KeyboardEvent) => {
          action.onSelect(action);
          e.preventDefault();
        });
      }
    });

    // Show command line
    Mousetrap.bind('mod+k', () => {
      this.showCommandLine();
    });
  }
}

const app = new App(userConfig);
export default app;
