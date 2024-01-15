import Client from './client';

export interface PluginBase {
  id: string;
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

export interface PluginConstructor {
  new (client: Client): PluginBase;
  id: string;
}

export default class Plugin implements PluginBase {
  client: Client;

  static id = '';
  id: string;

  constructor(client: Client) {
    this.client = client;
    this.id = (this.constructor as unknown as Plugin).id;
  }

  compatible() {
    return true;
  }

  destroy() {
    // @ts-ignore
    this.client = null;
  }
}
