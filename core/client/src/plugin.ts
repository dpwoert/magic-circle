import Client from './client';

export interface PluginBase {
  name: string;
  compatible: () => boolean;
  connect?: () => void;
  setup?: (element: Client['element']) => void;
  playState?: (playing: boolean) => void;
  startFrame?: (delta: number) => void;
  sync?: () => void;
  hydrate?: (data: any) => void;
  endFrame?: () => void;
  destroy: () => void;
}

export default class Plugin implements PluginBase {
  client: Client;

  name = '';

  constructor(client: Client) {
    this.client = client;
  }

  compatible() {
    return true;
  }

  destroy() {
    // @ts-ignore
    this.client = null;
  }
}
