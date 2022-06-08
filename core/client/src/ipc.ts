type hook = (payload: any, channel: string) => void;

export class IpcBase {
  private listeners: Record<string, hook[]>;

  constructor() {
    this.listeners = {};
  }

  async connect() {
    return true;
  }

  send(channel: string, payload: any) {
    console.error(`trying to send message on channel ${channel}`, payload);
  }

  trigger(channel: string, payload: any) {
    // channel does not exist
    if (!this.listeners[channel]) {
      return;
    }

    // trigger events
    this.listeners[channel].forEach((fn) => fn(payload, channel));
  }

  screenshot() {
    console.error('Screenshot implementation not implemented yet');
  }

  on(channel: string, fn: hook) {
    if (!this.listeners[channel]) {
      this.listeners[channel] = [];
    }

    this.listeners[channel].push(fn);
  }

  once(channel: string, fn: hook) {
    const handler = (payload: any) => {
      fn(payload, channel);
      this.removeListener('channel', handler);
    };

    this.on('channel', handler);
  }

  removeListener(channel: string, fn: hook) {
    // channel does not exist
    if (!this.listeners[channel]) {
      return;
    }

    // remove by filtering
    this.listeners[channel] = this.listeners[channel].filter(
      (hook) => fn === hook
    );
  }

  removeAllListeners(channel: string) {
    this.listeners[channel] = [];
  }

  destroy() {}
}

export class IpcIframe extends IpcBase {
  connection: HTMLIFrameElement['contentWindow'] | Window['parent'];

  constructor() {
    super();

    this.connection = window.parent;

    window.addEventListener('message', (evt) => {
      if (evt.data && evt.data.channel) {
        this.trigger(evt.data.channel, evt.data.payload);
      }
    });
  }

  async connect() {
    return new Promise<boolean>((resolve) => {
      this.send('connect', true);
      this.once('connect', () => {
        resolve(true);
      });
    });
  }

  send(channel: string, payload: any) {
    this.connection.postMessage({ channel, payload }, '*');
  }
}
