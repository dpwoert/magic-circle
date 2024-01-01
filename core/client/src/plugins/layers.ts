import type Control from '../control';
import Paths from '../paths';
import Plugin from '../plugin';
import Watcher from '../watcher';

export default class PluginLayers extends Plugin {
  private cache: Record<string, Control<any>> = {};
  watcher?: Watcher;

  name = 'layers';

  connect() {
    const { ipc } = this.client;

    if (ipc) {
      // listen to events
      ipc.on('control:set', (_, ...args) => this.set.call(this, ...args));
      ipc.on('control:reset', (_, ...args) => this.reset.call(this, ...args));
      ipc.on('controls:set', (_, ...args) => this.setAll.call(this, ...args));
      ipc.on('controls:reset', (_, ...args) =>
        this.resetAll.call(this, ...args)
      );
    }
  }

  hydrate(data: Record<string, any>) {
    if (data.layers) {
      this.generateCache();
      this.setAll(data.layers);
    }
  }

  private generateCache() {
    // Create cache of controls
    const controls: typeof this.cache = {};
    const watchers = {};

    this.client.layer.traverse((child, path) => {
      if ('value' in child) {
        controls[path] = child;
      }
      if ('watchChanges' in child) {
        watchers[path] = child;
      }
    });

    // Create watcher if needed
    const watcherKeys = Object.keys(watchers);
    const createWatcher = watcherKeys.length > 0 && this.client.ipc;

    if (createWatcher) {
      // Stop old watcher
      if (this.watcher) {
        this.watcher.stop();
      }

      // Create new watcher
      this.watcher = new Watcher(this.client);

      // Add controls
      watcherKeys.forEach((path) => this.watcher.add(path, watchers[path]));
    }

    // save to cache
    this.cache = controls;
  }

  sync() {
    this.generateCache();

    // Send to back-end
    if (this.client.ipc) {
      const layers = this.client.layer.toJSON('', new Paths()).children;
      this.client.ipc.send('layers', layers);
    }
  }

  destroy() {
    if (this.watcher) {
      this.watcher.stop();
    }
  }

  set(path: string, value: any) {
    const control = this.cache[path];

    if (control && 'value' in control) {
      control.value = value;
    } else {
      console.warn(`Trying to update control (${path}) that can not be found`);
    }
  }

  get(path: string): Control<any> | null {
    return this.cache[path];
  }

  reset(path: string) {
    const control = this.cache[path];

    if (control && 'value' in control) {
      control.reset();
    }
  }

  setAll(values: Record<string, any>) {
    Object.keys(values).forEach((key) => {
      this.set(key, values[key]);
    });
  }

  resetAll(sync = true) {
    const { layer } = this.client;

    layer.traverse((control) => {
      if (control && 'value' in control && !control.blockHydrate) {
        control.reset();
      }
    });

    // and sync again so editor is correct
    if (sync) {
      this.sync();
    }
  }
}
