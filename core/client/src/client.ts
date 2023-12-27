import type { default as Plugin, PluginBase } from './plugin';
import Layer, { Child } from './layer';
import { IpcBase, IpcIframe } from './ipc';

import PluginLayers from './plugins/layers';
import PluginSeed from './plugins/seed';
import PluginScreenshot from './plugins/screenshots';
import PluginRecordings from './plugins/recordings';
import PluginPerformance from './plugins/performance';
import PluginTimeline from './plugins/timeline';

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
  PluginTimeline,
];

export default class MagicCircle {
  private hooks: {
    loop?: loopFn;
    setup?: setupFn;
    resize?: resizeFn;
  };

  private arguments: {
    plugins?: typeof Plugin[];
    ipc?: typeof IpcBase;
  };
  private plugins: PluginBase[];
  ipc: IpcBase;
  layer: Layer;

  private lastTime: number;
  private frameRequest: ReturnType<typeof requestAnimationFrame>;
  private syncRequest: ReturnType<typeof setTimeout>;
  private autoPlay: boolean;
  private setupCalled: boolean;
  element: HTMLElement;
  isPlaying: boolean;
  isConnected: boolean;
  setupDone: boolean;

  constructor(plugins: typeof Plugin[] = [], ipc?: typeof IpcBase) {
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

    this.arguments = { plugins, ipc };
    this.layer = new Layer('base', this);
    this.isPlaying = false;
    this.autoPlay = false;
    this.isConnected = false;
    this.setupCalled = false;
    this.setupDone = false;
  }

  private async setupWithIPC() {
    const Ipc = this.arguments.ipc || IpcIframe;

    // Create plugins and IPC
    this.plugins = [...STANDARD_PLUGINS, ...this.arguments.plugins].map(
      (Plugin) => new Plugin(this)
    );
    this.ipc = new Ipc();
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

    this.setupDone = true;

    // Play if wanted
    if (this.autoPlay) {
      this.start();
    }
  }

  private async setupWithoutIPC() {
    this.plugins = [...STANDARD_PLUGINS, ...this.arguments.plugins].map(
      (Plugin) => new Plugin(this)
    );

    // run setup hooks
    await this.runSetupHook();

    this.setupDone = true;

    // Play if needed
    if (this.autoPlay) {
      this.start();
    }
  }

  private async runSetupHook() {
    // run setup hooks
    if (this.hooks.setup) {
      const element = await this.hooks.setup(this);
      if (element) this.element = element;
    }

    // Run setup hook if needed so plugins can read element
    this.plugins.forEach((p) => {
      if (p.setup) {
        p.setup(this.element);
      }
    });
  }

  async connect() {
    await this.ipc.connect();
    this.isConnected = true;

    // Send page information to UI
    this.ipc.send('page-information', {
      title: document.title,
      location: JSON.parse(JSON.stringify(window.location)),
    });

    // Does the client have a loop?
    this.ipc.send('loop-set', !!this.hooks.loop);

    // run setup hooks
    await this.runSetupHook();

    // run plugins on start
    this.plugins.forEach((p) => {
      if (p.connect) {
        p.connect();
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
    this.flush();

    // Let editor know we're ready
    this.ipc.send('ready', true);
  }

  setup(fn?: setupFn) {
    if (this.setupDone) {
      throw new Error('Can not change setup function after it has already run');
    }

    this.setupCalled = true;

    if (fn) {
      this.hooks.setup = fn;
    }

    if (window.location !== window.parent.location || this.arguments.ipc) {
      this.setupWithIPC();
    } else {
      this.setupWithoutIPC();
    }

    return this;
  }

  loop(fn: loopFn) {
    this.hooks.loop = fn;

    if (this.ipc) this.ipc.send('loop-set', true);

    return this;
  }

  resize(): resizeFn;
  resize(fn: resizeFn): MagicCircle;

  resize(fn?: resizeFn): unknown {
    if (fn) this.hooks.resize = fn;
    return fn ? this : this.hooks.resize;
  }

  sync() {
    if (!this.setupDone) return;

    if (this.syncRequest) {
      clearTimeout(this.syncRequest);
    }

    // debounce sync
    this.syncRequest = setTimeout(() => {
      this.flush();
    }, 12);
  }

  flush() {
    this.plugins.forEach((p) => {
      if (p.sync) {
        p.sync();
      }
    });
  }

  start() {
    if (!this.setupCalled) {
      throw new Error(
        'Magic Circle setup has not been invoked, make sure to run magicCircle.setup(...)'
      );
    }

    if (!this.setupDone) {
      this.autoPlay = true;
      return this;
    }

    // Stop all future frames
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }

    // Start and save to state
    this.isPlaying = true;
    this.tick();

    if (this.ipc) {
      // Send to editor
      this.ipc.send('play', true);

      // update plugins
      this.plugins.forEach((p) => {
        if (p.playState) {
          p.playState(true);
        }
      });
    }

    return this;
  }

  stop() {
    if (this.ipc) this.ipc.send('play', false);
    this.isPlaying = false;

    // Stop all future frames
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }

    // update plugins
    this.plugins.forEach((p) => {
      if (p.playState) {
        p.playState(false);
      }
    });

    return this;
  }

  step(customDelta?: number) {
    // calculate delta
    const newTime = (
      typeof performance === 'undefined' ? Date : performance
    ).now();
    const delta = this.lastTime ? (newTime - this.lastTime) / 1000 : 0;
    this.lastTime = newTime;

    this.plugins.forEach((p) => {
      if (p.startFrame) {
        p.startFrame(customDelta ?? delta);
      }
    });

    // do user action
    if (this.hooks.loop) {
      this.hooks.loop(customDelta ?? delta);
    }

    this.plugins.forEach((p) => {
      if (p.endFrame) {
        p.endFrame();
      }
    });
  }

  tick() {
    this.step();

    // playing?
    if (this.isPlaying) {
      this.frameRequest = requestAnimationFrame(this.tick);
    }
  }

  destroy() {
    this.stop();
    this.hooks = {};

    if (this.ipc) {
      this.ipc.destroy();
    }

    if (this.syncRequest) {
      clearTimeout(this.syncRequest);
    }

    this.plugins.forEach((p) => {
      if (p.destroy) {
        p.destroy();
      }
    });

    this.plugins = [];
    this.arguments = {};
  }

  plugin<T extends PluginBase>(name: string): T {
    if (!this.plugins) {
      throw new Error('Plugins not created yet, first run the setup() call');
    }

    return this.plugins.find((p) => p.name === name) as T;
  }

  add(layer: Child | Child[]) {
    this.layer.add(layer);
  }
}
