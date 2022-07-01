import type { default as Plugin, PluginBase } from './plugin';
import Layer from './layer';
import { IpcBase, IpcIframe } from './ipc';

import PluginLayers from './plugins/layers';
import PluginSeed from './plugins/seed';
import PluginScreenshot from './plugins/screenshots';
import PluginRecordings from './plugins/recordings';
import PluginPerformance from './plugins/performance';

type setupFn = (
  client: MagicCircle
) => void | HTMLElement | Promise<void | HTMLElement>;

type loopFn = (delta: number) => void;

type resizeFn = (width: number, height: number, element?: HTMLElement) => void;

const STANDARD_PLUGINS = [
  PluginLayers,
  PluginSeed,
  PluginPerformance,
  PluginScreenshot,
  PluginRecordings,
];

export default class MagicCircle {
  private hooks: {
    loop?: loopFn;
    setup?: setupFn;
    resize?: resizeFn;
  };

  private plugins: PluginBase[];
  ipc: IpcBase;
  layer: Layer;

  private lastTime: number;
  private frameRequest: ReturnType<typeof requestAnimationFrame>;
  element: HTMLElement;
  isPlaying: boolean;
  autoPlay: boolean;
  isConnected: boolean;

  constructor(plugins: typeof Plugin[] = []) {
    // setup initial hooks
    this.hooks = {
      setup: null,
      loop: null,
      resize: null,
    };

    // event binding
    this.tick = this.tick.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    this.layer = new Layer('base');
    this.isPlaying = false;
    this.autoPlay = true;
    this.isConnected = false;

    // Do setup
    if (window.location !== window.parent.location) {
      this.setupWithIPC(plugins);
    }
  }

  async setupWithIPC(plugins: typeof Plugin[] = []) {
    // Create plugins and IPC
    this.plugins = [...STANDARD_PLUGINS, ...plugins].map(
      (Plugin) => new Plugin(this)
    );
    this.ipc = new IpcIframe();
    this.ipc.setup();

    // start
    await this.connect();

    // listen to events
    this.ipc.on('play', (_, playing) => {
      if (playing) this.start();
      else this.stop();
    });
    this.ipc.on('refresh', () => {
      location.reload();
    });
  }

  async setupWithoutIPC() {
    this.layer = new Layer('base');
    this.plugins = [];

    // run setup hooks
    if (this.hooks.setup) {
      const element = await this.hooks.setup(this);
      if (element) this.element = element;
    }
  }

  async connect() {
    await this.ipc.connect();
    this.isConnected = true;

    // Send page information to UI
    this.ipc.send('page-information', {
      title: document.title,
      location: JSON.parse(JSON.stringify(window.location)),
    });

    // run setup hooks
    if (this.hooks.setup) {
      const element = await this.hooks.setup(this);
      if (element) this.element = element;
    }

    // run plugins on start
    this.plugins.forEach((p) => {
      if (p.setup) {
        p.setup();
      }
    });

    // Receive default values by hydrating (one reload for example)
    const hydration = await this.ipc.invoke<Record<string, any>>('hydrate');
    this.plugins.forEach((p) => {
      if (p.hydrate && hydration) {
        p.hydrate(hydration);
      }
    });

    // sync values
    this.sync();

    // Let editor know we're ready
    this.ipc.send('ready', true);

    // Play if wanted
    if (this.autoPlay) {
      this.start();
    }
  }

  setup(fn: setupFn) {
    this.hooks.setup = fn;

    // No IPC will load so need to do setup now
    if (!this.ipc) {
      this.setupWithoutIPC();
    }

    return this;
  }

  loop(fn: loopFn) {
    this.hooks.loop = fn;
    return this;
  }

  resize(): resizeFn;
  resize(fn: resizeFn): MagicCircle;

  resize(fn?: resizeFn): unknown {
    if (fn) this.hooks.resize = fn;
    return fn ? this : this.hooks.resize;
  }

  sync() {
    this.plugins.forEach((p) => {
      if (p.sync) {
        p.sync();
      }
    });
  }

  start() {
    if (!this.isConnected && this.ipc) {
      this.autoPlay = true;
      return this;
    }

    if (!this.ipc) {
      this.startWithoutEditor();
      return this;
    }

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

  private startWithoutEditor() {
    // Stop all future frames
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }

    // Start and save to state
    this.isPlaying = true;
    this.tick();
  }

  stop() {
    if (this.ipc) this.ipc.send('play', false);
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
    if (this.hooks.loop) {
      this.hooks.loop(customDelta ?? delta);
    }

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

  destroy() {
    this.stop();
    this.plugins = null;
    this.hooks = null;

    this.plugins.forEach((p) => {
      if (p.destroy) {
        p.destroy();
      }
    });
  }

  plugin<T extends PluginBase>(name: string): T {
    return this.plugins.find((p) => p.name === name) as T;
  }
}
