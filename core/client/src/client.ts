import type { default as Plugin, PluginBase } from './plugin';
import Layer from './layer';
import { IpcBase, IpcIframe } from './ipc';

import PluginLayers from './plugins/layers';
import PluginSeed from './plugins/seed';
import PluginPerformance from './plugins/performance';

type setupFn = (client: MagicCircle) => void;

type loopFn = (delta: number) => void;

const warnOnTrigger = (name: string) => () => {
  console.warn(`The hook '${name}' is not set`);
};

export default class MagicCircle {
  private hooks: {
    loop: loopFn;
    setup: setupFn;
  };

  private plugins: PluginBase[];
  ipc: IpcBase;
  layer: Layer;

  private lastTime: number;
  private frameRequest: ReturnType<typeof requestAnimationFrame>;
  isPlaying: boolean;

  constructor(plugins: typeof Plugin[] = []) {
    const standardPlugins = [PluginLayers, PluginSeed, PluginPerformance];

    // setup initial hooks
    this.hooks = {
      setup: warnOnTrigger('setup'),
      loop: warnOnTrigger('loop'),
    };

    this.layer = new Layer('base');
    this.plugins = [...standardPlugins, ...plugins].map(
      (plugin) => new plugin(this)
    );
    this.ipc = new IpcIframe();
    this.ipc.setup();
    this.isPlaying = false;

    // start
    this.connect();

    //event binding
    this.tick = this.tick.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // listen to events
    this.ipc.on('play', (_, playing) => {
      if (playing) this.start();
      else this.stop();
    });
    this.ipc.on('refresh', () => {
      location.reload();
    });
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
      this.hooks.setup(this);
    }

    // run plugins
    this.plugins.forEach((p) => {
      if (p.connect) {
        p.connect();
      }
    });

    // Receive default values by hydrating
    // todo

    this.ipc.send('ready', true);
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
    // Stop all future frames
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }

    // Start and save to state
    this.isPlaying = true;
    this.tick();

    // Send to editor
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
    this.isPlaying = false;

    // update plugins
    this.plugins.forEach((p) => {
      if (p.playState) {
        p.playState(false);
      }
    });

    return this;
  }

  tick(customDelta?: number) {
    this.plugins.forEach((p) => {
      if (p.startFrame) {
        p.startFrame();
      }
    });

    // calculate delta
    const newTime = (
      typeof performance === 'undefined' ? Date : performance
    ).now();
    const delta = this.lastTime ? (newTime - this.lastTime) / 1000 : 0;
    this.lastTime = newTime;

    // do user action
    this.hooks.loop(customDelta ?? delta);

    // playing?
    if (this.isPlaying) {
      this.frameRequest = requestAnimationFrame(this.tick);
    }

    this.plugins.forEach((p) => {
      if (p.endFrame) {
        p.endFrame();
      }
    });
  }

  plugin(name: string) {
    return this.plugins.find((p) => p.name === name);
  }
}
