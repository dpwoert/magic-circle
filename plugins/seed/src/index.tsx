import { Plugin, App, LayoutHook } from '@magic-circle/schema';
import { Store } from '@magic-circle/state';

import Header from './Header';

export default class Seed implements Plugin {
  ipc: App['ipc'];
  client: App;

  name = 'seed';

  seed: Store<number>;

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;

    this.seed = new Store<number>(0);

    this.ipc.on('seed', (_, seed: number) => {
      this.seed.set(seed);
    });

    // Set controls sidebar
    this.client.setLayoutHook(
      LayoutHook.HEADER_RIGHT,
      <Header store={this.seed} generate={() => this.generate()} />
    );
  }

  generate() {
    this.ipc.send('seed:generate');
  }

  async save() {
    return this.seed.value;
  }

  async load(seed) {
    this.ipc.send('seed:set', seed);
  }
}
