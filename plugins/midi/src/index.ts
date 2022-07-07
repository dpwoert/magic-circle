import { Plugin, App } from '@magic-circle/schema';

export default class Midi implements Plugin {
  ipc: App['ipc'];
  client: App;

  name = 'midi';

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;
  }
}
