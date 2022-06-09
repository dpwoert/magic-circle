import type Control from '../control';
import Plugin from '../plugin';

export default class PluginLayers extends Plugin {
  cache: Record<string, Control<any>>;

  connect() {
    const { ipc } = this.client;

    // listen to events
    ipc.on('control:set', this.set.bind(this));
    ipc.on('control:reset', this.reset.bind(this));
    ipc.on('controls:set', this.resetAll.bind(this));
    ipc.on('controls:reset', this.resetAll.bind(this));

    this.sync();
  }

  sync() {
    const layers = this.client.layer.toJSON().children;

    // Create cache of controls
    const controls: typeof this.cache = {};
    this.client.layer.forEachRecursive((child) => {
      if ('value' in child) {
        controls[child.id] = child;
      }
    });

    // Send to back-end
    this.client.ipc.send('layers', {
      controls: Object.values(controls).map((c) => c.toJSON()),
      layers,
    });

    // save to cache
    this.cache = controls;
  }

  set(id: string, value: any) {
    const { layer } = this.client;
    const control = layer.find(id);

    if (control && 'value' in control) {
      control.value(value);
    }
  }

  reset(id: string) {
    const { layer } = this.client;
    const control = layer.find(id);

    if (control && 'value' in control) {
      control.reset();
    }
  }

  setAll(values: Record<string, any>) {
    Object.keys(values).forEach((key) => {
      this.set(key, values[key]);
    });
  }

  resetAll() {
    const { layer } = this.client;
    layer.forEachRecursive((control) => {
      if (control && 'value' in control) {
        control.reset();
      }
    });
  }
}
