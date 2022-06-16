import Plugin from '../plugin';

export default class PluginSeed extends Plugin {
  seed: number;

  name = 'seed';

  connect() {
    const { ipc } = this.client;

    // listen to events
    ipc.on('seed:set', (_, seed) => this.set(seed));
    ipc.on('seed:generate', (_, seed) => this.generate());
    this.generate();
  }

  set(seed: number) {
    this.seed = seed;
    this.client.ipc.send('seed', this.seed);
  }

  generate() {
    this.set(Math.random());
  }
}
