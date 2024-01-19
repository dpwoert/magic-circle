import type Control from '../control';
import type Layer from '../layer';
import Paths from '../paths';
import Plugin from '../plugin';
import Watcher from '../watcher';

export default class PluginLayers extends Plugin {
  static id = 'layers';

  private cache: Record<string, Control<any> | Layer> = {};
  watcher?: Watcher;
  currentlyVisibleLayer?: Layer;

  connect() {
    const { ipc } = this.client;

    if (ipc) {
      // listen to events
      // @ts-ignore
      ipc.on('control:set', (_, ...args) => this.set.call(this, ...args));
      // @ts-ignore
      ipc.on('control:reset', (_, ...args) => this.reset.call(this, ...args));
      // @ts-ignore
      ipc.on('controls:set', (_, ...args) => this.setAll.call(this, ...args));
      // @ts-ignore
      ipc.on('controls:reset', (_, ...args) =>
        this.resetAll.call(this, ...args)
      );
      ipc.on('layer:visible', (_, ...args) =>
        // @ts-ignore
        this.setVisible.call(this, ...args)
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
    const cache: typeof this.cache = {};
    const watchers: Record<string, Control<any, any>> = {};

    this.client.layer.traverse((child, path) => {
      cache[path] = child;

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
      watcherKeys.forEach((path) => this.watcher?.add(path, watchers[path]));
    }

    // save to cache
    this.cache = cache;
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

  get(path: string): Control<any> | Layer | null {
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

  setVisible(path: string) {
    const layer = this.cache[path];

    if (layer && 'value' in layer === false) {
      // trigger visible: false event for previously visible layer
      if (this.currentlyVisibleLayer) {
        this.currentlyVisibleLayer.trigger('visible', false);

        this.currentlyVisibleLayer.traverse((child) => {
          if ('value' in child) {
            child.trigger('visible', false);
          }
        });
      }

      // trigger visible: false event for next visible layer
      layer.trigger('visible', true);
      this.currentlyVisibleLayer = layer;

      layer.traverse((child) => {
        if ('value' in child) {
          child.trigger('visible', true);
        }
      });
    }
  }
}
