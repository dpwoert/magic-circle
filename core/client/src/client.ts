import type Plugin from './plugin';
import Layer from './layer';
import { IpcBase, IpcIframe } from './ipc';

import PluginLayers from './plugins/layers';
import PluginSeed from './plugins/seed';

type setupFn = () => void;

type loopFn = (delta: number) => void;

export default class MagicCircle {
  private hooks: {
    loop: loopFn;
    setup: setupFn;
  };

  private plugins: Plugin[];
  ipc: IpcBase;
  layer: Layer;

  constructor(plugins: typeof Plugin[]) {
    const standardPlugins = [PluginLayers, PluginSeed];

    this.layer = new Layer('base');
    this.plugins = [...standardPlugins, ...plugins].map(
      (plugin) => new plugin(this)
    );
    this.ipc = new IpcIframe();

    // start
    this.connect();
  }

  async connect() {
    await this.ipc.connect();

    // Send page information to UI
    this.ipc.send('page-information', {
      title: document.title,
      location: JSON.parse(JSON.stringify(window.location)),
    });

    // run setup hooks
    if (this.hooks.setup) {
      this.hooks.setup();
    }

    // run plugins
    this.plugins.forEach((p) => {
      if (p.connect) {
        p.connect();
      }
    });

    // receive default values
    // todo
  }

  setup(fn: setupFn) {
    this.hooks.setup = fn;
    return this;
  }

  loop(fn: loopFn) {
    this.hooks.loop = fn;
    return this;
  }

  start() {
    this.ipc.send('play', true);

    // update plugins
    this.plugins.forEach((p) => {
      if (p.playState) {
        p.playState(true);
      }
    });

    return this;
  }

  stop() {
    this.ipc.send('play', false);

    // update plugins
    this.plugins.forEach((p) => {
      if (p.playState) {
        p.playState(false);
      }
    });

    return this;
  }

  tick(delta?: number) {
    //todo
  }
}
