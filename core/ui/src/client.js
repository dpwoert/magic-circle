import dotProp from 'dot-prop';

import defaultSettings from './default-settings';
import Store from './store';

const { ipcRenderer } = require('electron');

/* eslint-disable class-methods-use-this */

export class Client {
  constructor(settings, cwd) {
    this.isElectron = true;
    this.settings = Object.assign(defaultSettings, settings);
    this.cwd = cwd;
    console.info('cwd', cwd);

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
    ipcRenderer.on(channel, fn);
  }

  removeListener(channel, fn) {
    ipcRenderer.removeListener(channel, fn);
  }

  sendMessage(channel, payload) {
    ipcRenderer.send('intercom', { channel, payload, to: 'frame' });
  }

  refresh() {
    ipcRenderer.send('refresh');
  }

  getPlugin(name) {
    return this.plugins.find(p => p._name === name); //eslint-disable-line
  }

  getSetting(path, d) {
    return dotProp.get(this.settings, path, d);
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
    ipcRenderer.send(`resize-${window}`, { width, height });
  }

  takeScreenshot() {
    const changelog = this.createChangelog
      ? this.mapToJSON(this.createChangelog())
      : [];
    const seed = this.getSeed ? this.getSeed() : null;
    const data = {
      changelog,
      seed,
    };
    ipcRenderer.send('screenshot', data);
  }

  devTools() {
    const mode = this.getSetting('debug.devTools');
    ipcRenderer.send('dev-tools', { mode });
  }
}
