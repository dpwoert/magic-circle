import { Plugin, LayoutHook } from '@magic-circle/schema';
import { Store } from '@magic-circle/state';

import Header from './Header';

export default class Seed extends Plugin {
  name = 'seed';
  seed = new Store<number>(0);

  async setup() {
    this.ipc.on('seed', (_, seed: number) => {
      this.seed.set(seed);
    });

    // Set controls sidebar
    this.app.setLayoutHook(
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

  async load(seed: number) {
    this.ipc.send('seed:set', seed);
  }

  hydrate() {
    return this.seed.value;
  }
}
