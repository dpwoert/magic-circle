import Client from './client';
import Control from './control';

export default class Watcher {
  client: Client;
  controls: Map<string, Control<any>>;
  lastValues: Map<Control<any>, any>;

  watchTimeout?: ReturnType<typeof setTimeout>;

  constructor(client: Client) {
    this.client = client;
    this.controls = new Map();
    this.lastValues = new Map();

    // Start watching
    this.tick = this.tick.bind(this);
    this.tick();
  }

  add(path: string, control: Control<any>) {
    this.controls.set(path, control);
    this.lastValues.set(control, control.value);
  }

  stop() {
    if (this.watchTimeout) {
      clearInterval(this.watchTimeout);
    }
  }

  private tick() {
    this.controls.forEach((control, path) => {
      const lastValue = this.lastValues.get(control);

      if (lastValue !== control.value) {
        this.client.ipc.send('control:set-value', path, control.value);
      }
    });

    // Schedule next check
    this.watchTimeout = setTimeout(this.tick, 100);
  }
}
