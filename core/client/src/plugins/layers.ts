import Plugin from '../plugin';

export default class PluginLayers extends Plugin {
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
    this.client.ipc.send('layers', layers);
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
    Object.keys(values).forEach(key => {
      this.set(key, values[key]);
    });
  }

  resetAll() {
    const { layer } = this.client;
    layer.forEachRecursive(control => {
      if (control && 'value' in control) {
        control.reset();
      }
    });
  }
}
