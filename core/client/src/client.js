import isElectron from 'is-electron';

import LayersPlugin from './plugins/layers';
import SeedPlugin from './plugins/seed';
import PerformancePlugin from './plugins/performance';

/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

// load ipc renderer
let ipcRenderer = null;

export class Client {
  constructor(...plugins) {
    this.frames = 0;
    this.listeners = [];
    this.channels = [];
    this.fn = {
      setup: () => {},
      loop: () => {},
    };

    // add plugins
    plugins.push(LayersPlugin);
    plugins.push(SeedPlugin);
    plugins.push(PerformancePlugin);
    this.plugins = plugins.map(P => new P(this));

    // event binding
    this.nextFrame = this.nextFrame.bind(this);

    if (isElectron()) {
      // Add to window global to it can be reached by Electron
      window.__controls = this;
    }
  }

  connect() {
    if (window.__IPC) {
      console.info('🔌 Magic Circle loaded');
      ipcRenderer = window.__IPC;

      this.sendMessage('connect');

      // create all plugins
      this.plugins.forEach(p => (p.connect ? p.connect() : null));

      // Send page information to front-end
      this.sendMessage('page-information', {
        title: document.title,
      });

      // trigger setup hook
      this.sendMessage('setup');
      ipcRenderer.once('setup-response', (evt, payload) => {
        // run setup script
        if (this.fn.setup) {
          this.fn.setup(this);
        }

        // run actions after setup is done
        this.batch(evt, payload);

        // make sure all is synced
        if (this.regenerate) {
          this.regenerate();
        }

        // start rendering
        this.play();
      });
    }
  }

  trigger(channel, evt, payload) {
    this.listeners.forEach(l => {
      if (l.channel === channel) {
        l.fn(evt, payload);
      }
    });
  }

  batch(evt, payload) {
    payload.batch.forEach(message => {
      this.trigger(message.channel, evt, message.payload);
    });
  }

  addListener(channel, fn) {
    this.listeners.push({ channel, fn });
    this.resetListeners();
  }

  removeListener(fn) {
    for (let i = this.listeners.length - 1; i >= 0; i -= 1) {
      if (this.listeners[i].fn === fn) {
        this.listeners.splice(i, 1);
      }
    }

    this.resetListeners();
  }

  resetListeners() {
    if (ipcRenderer) {
      // delete all listeners
      this.channels.forEach(channel => ipcRenderer.removeAllListeners(channel));
      this.channels = [];

      // get all channels
      this.listeners.forEach(l => {
        if (this.channels.indexOf(l.channel) === -1) {
          this.channels.push(l.channel);
        }
      });

      // recreate listeners
      this.channels.forEach(channel => {
        ipcRenderer.on(channel, (evt, payload) => {
          this.trigger(channel, evt, payload);
        });
      });

      // play/stop messages
      ipcRenderer.on('change-play-state', (evt, payload) => {
        if (payload === true) {
          this.play();
        } else {
          this.stop();
        }
      });

      // batch messages
      ipcRenderer.on('batch', (evt, payload) => {
        this.batch(evt, payload);
      });
    }
  }

  sendMessage(channel, payload) {
    if (ipcRenderer) {
      ipcRenderer.send('intercom', { channel, payload, to: 'editor' });
    }
  }

  startFrame() {}

  endFrame() {}

  nextFrame() {
    // measure FPS
    this.startFrame();

    // do user action
    if (this.fn.loop) {
      this.fn.loop();
    }

    // end of FPS measurement
    this.endFrame();

    // Schedule next frame
    this.frameRequest = requestAnimationFrame(this.nextFrame);
  }

  play() {
    this.stop();
    this.frameRequest = requestAnimationFrame(this.nextFrame);
    this.sendMessage('play');
  }

  stop() {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
    this.sendMessage('stop');
  }

  setup(fn) {
    this.fn.setup = fn;

    // if it isn't run by electron, make sure to run it now
    if (!isElectron()) {
      this.fn.setup(this);
    }

    return this;
  }

  loop(fn) {
    this.fn.loop = fn;

    // start playing if it isn't run by electron, no need to wait
    if (!isElectron()) {
      this.play();
    }

    return this;
  }
}
