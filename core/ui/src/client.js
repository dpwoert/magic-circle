import dotProp from 'dot-prop';
import isElectron from 'is-electron';

import defaultSettings from './default-settings';
import Store from './store';
import addPluginMenu from './plugin-menu';
import * as icons from './icons';

/* eslint-disable class-methods-use-this */

export class Client {
  constructor(settings, cwd) {
    if (settings.plugins) {
      // eslint-disable-next-line
      settings.plugins =
        typeof settings.plugins === 'function'
          ? settings.plugins(defaultSettings.plugins)
          : settings.plugins;
    }

    this.ipc = settings.ipc;
    this.isElectron = isElectron();
    this.cwd = cwd;

    this.buttons = new Store();
    this.buttons.collection = this.getButtons.bind(this);
    this.icons = icons;

    // create settings
    this.settings = Object.assign(defaultSettings, settings);
    this.settings.plugins.forEach(plugin => {
      if (plugin.standaloneSettings) {
        this.settings[plugin.name] = plugin.standaloneSettings(
          this.settings[plugin.name]
        );
      }
      if (plugin.defaultSettings) {
        this.settings[plugin.name] = Object.assign(
          plugin.defaultSettings(this),
          settings[plugin.name]
        );
      }
    });

    // add plugins
    this.plugins = this.settings.plugins
      .filter(
        Plugin =>
          (this.isElectron && Plugin.electronOnly) || !Plugin.electronOnly
      )
      .map(Plugin => {
        const initialData = Plugin.initStore
          ? Plugin.initStore(this.settings)
          : {};
        const store = new Store(initialData);
        const plugin = new Plugin(this, store, this.settings);
        plugin._name = Plugin.name; //eslint-disable-line

        // button collections
        if (plugin.buttons) {
          plugin.buttons(this.buttons);
        }

        // load electron plugins?
        if (this.isElectron && plugin.electron) {
          let files = plugin.electron();
          files = Array.isArray(files) ? files : [files];
          this.sendAction('electron-load', {
            files,
            settings: this.settings,
            cwd: __dirname,
          });
        }

        // menu for this plugin?
        if (this.isElectron && plugin.applicationMenu) {
          addPluginMenu(
            Plugin.name.charAt(0).toUpperCase() + Plugin.name.slice(1),
            plugin.applicationMenu()
          );
        }

        return plugin;
      });

    // send message to front-end
    this.sendMessage('editor-loaded', true);

    // render on finish loading
    this.settings.render(this);

    // listen to refreshes
    this.addListener('setup', () => this.setup());
  }

  async setup() {
    let actions = [];
    await this.plugins.forEach(async s => {
      if (s.setup) {
        const action = await s.setup(this);

        // added to list of actions
        if (Array.isArray(action)) {
          actions = actions.concat(action);
        } else {
          actions.push(action);
        }
      }
    });

    // send message to front-end
    this.sendMessage('setup-response', {
      batch: actions,
    });
  }

  addListener(channel, fn) {
    this.ipc.on(channel, fn);
  }

  removeListener(channel, fn) {
    this.ipc.removeListener(channel, fn);
  }

  sendMessage(channel, payload) {
    this.ipc.send('intercom', { channel, payload, to: 'frame' });
  }

  sendAction(action, payload) {
    this.ipc.send(action, payload);
  }

  refresh() {
    this.ipc.send('refresh');
  }

  getPlugin(name) {
    return this.plugins.find(p => p._name === name); //eslint-disable-line
  }

  getSetting(path, d) {
    return dotProp.get(this.settings, path, d);
  }

  getButtons() {
    const buttons = {
      play: [],
      frame: [],
      debug: [],
    };

    // group
    Object.values(this.buttons.get()).forEach(b => {
      buttons[b.collection] = buttons[b.collection] || [];
      buttons[b.collection].push(b);
    });

    return buttons;
  }

  mapToJSON(map) {
    const list = [];

    map.forEach((value, key) => {
      list.push({ key, value });
    });

    return list;
  }

  JSONToMap(list) {
    const map = new Map();
    list.forEach(i => {
      map.set(i.key, i.value);
    });
    return map;
  }

  resize(window, width, height) {
    this.ipc.send(`resize-${window}`, { width, height });
  }
}
