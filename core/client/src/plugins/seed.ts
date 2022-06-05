import Plugin from '../plugin';

export default class PluginSeed extends Plugin {
  seed: number;

  connect() {
    const { ipc } = this.client;

    // listen to events
    ipc.on('seed:set', this.set.bind(this));
  }

  set(seed: number) {
    this.seed = seed;
    this.client.ipc.send('seed', this.seed);
  }

  generate() {
    this.set(Math.random());
  }
}
