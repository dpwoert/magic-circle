import Plugin from '../plugin';

export default class PluginSeed extends Plugin {
  name = 'seed';
  seed = 0;

  constructor(client: Plugin['client']) {
    super(client);
    this.generate();
  }

  connect() {
    const { ipc } = this.client;

    if (!ipc) {
      throw new Error('IPC not defined');
    }

    // listen to events
    ipc.on('seed:set', (_, seed) => {
      this.set(seed);
      this.sync();
    });
    ipc.on('seed:generate', () => {
      this.generate();
      this.sync();
    });
  }

  hydrate(hydration: Record<string, any>) {
    if (hydration.seed) {
      this.set(hydration.seed);
    }
  }

  sync() {
    if (this.client.ipc) {
      this.client.ipc.send('seed', this.seed);
    }
  }

  set(seed: number) {
    this.seed = seed;
  }

  generate() {
    const newSeed = Math.random();
    this.set(newSeed);
  }
}
