import Client from './client';

export default class Plugin {
  client: Client;

  constructor(client) {
    this.client = client;
  }

  compatible() {
    return true;
  }

  connect() {
    // todo
  }

  playState(playing: boolean) {}

  destroy() {
    this.client = null;
  }
}
