import Client from './client';

export interface PluginBase {
  name: string;
  compatible: () => boolean;
  connect?: () => void;
  playState?: (playing: boolean) => void;
  startFrame?: () => void;
  sync?: () => void;
  hydrate?: (data: any) => void;
  endFrame?: () => void;
  destroy: () => void;
}

export default class Plugin implements PluginBase {
  client: Client;

  name = '';

  constructor(client) {
    this.client = client;
  }

  compatible() {
    return true;
  }

  destroy() {
    this.client = null;
  }
}
