type hook = (channel: string, ...payload: any[]) => void;

export class IpcBase {
  listeners: Record<string, Set<hook>>;

  constructor() {
    this.listeners = {};
  }

  setup() {
    // to overwrite
  }

  async connect() {
    return true;
  }

  send(channel: string, ...payload: any[]) {
    console.error(`trying to send message on channel ${channel}`, payload);
  }

  trigger(channel: string, payload: any[]) {
    // channel does not exist
    if (!this.listeners[channel]) {
      return;
    }

    // trigger events
    this.listeners[channel].forEach((fn) =>
      fn.apply(undefined, [channel, ...payload])
    );
  }

  on(channel: string, fn: hook) {
    if (!this.listeners[channel]) {
      this.listeners[channel] = new Set();
    }

    this.listeners[channel].add(fn);
  }

  once(channel: string, fn: hook) {
    const handler: hook = (_, ...payload: any[]) => {
      fn.apply(undefined, [channel, ...payload]);
      this.removeListener(channel, handler);
    };

    this.on(channel, handler);
  }

  invoke<T>(channel: string, ...payload: any[]): Promise<T> {
    return new Promise((resolve) => {
      this.send(channel, ...payload);
      this.once(channel, (_, response) => {
        resolve(response);
      });
    });
  }

  removeListener(channel: string, fn: hook) {
    // channel does not exist
    if (!this.listeners[channel]) {
      return;
    }

    // remove by filtering
    this.listeners[channel].delete(fn);
  }

  removeAllListeners(channel: string) {
    if (this.listeners[channel]) {
      this.listeners[channel].clear();
    }
  }

  reset() {
    this.listeners = {};
  }

  destroy() {
    this.listeners = {};
  }
}

enum IframeMode {
  CHILD,
  PARENT,
}

export class IpcIframe extends IpcBase {
  mode: IframeMode;
  connection: HTMLIFrameElement['contentWindow'] | Window['parent'];
  isConnected: boolean;

  constructor() {
    super();

    if (window.parent) {
      this.mode = IframeMode.CHILD;
      this.connection = window.parent;
    } else {
      this.mode = IframeMode.PARENT;
    }
  }

  setup(selector = 'iframe') {
    // connect to either
    if (window.location !== window.parent.location) {
      this.mode = IframeMode.CHILD;
      this.connection = window.parent;
    } else {
      this.mode = IframeMode.PARENT;

      const iframe: HTMLIFrameElement = document.querySelector(
        selector || 'iframe'
      );

      if (!iframe) {
        throw new Error('can not find iframe element');
      }

      this.connection = iframe.contentWindow;
    }

    // setup events
    this.receiveMessage = this.receiveMessage.bind(this);
    window.addEventListener('message', this.receiveMessage);
  }

  private receiveMessage(evt) {
    if (evt.data && evt.data.channel) {
      this.trigger(evt.data.channel, evt.data.payload);
    }
  }

  async connect() {
    return new Promise<boolean>((resolve) => {
      if (this.isConnected) {
        resolve(true);
        return;
      }

      if (this.mode === IframeMode.CHILD) {
        this.send('connect', true);
        this.once('connect', () => {
          this.isConnected = true;
          resolve(true);
        });
      } else {
        this.once('connect', () => {
          this.isConnected = true;
          resolve(true);
          this.send('connect', true);
        });
      }
    });
  }

  send(channel: string, ...payload: any[]) {
    this.connection.postMessage({ channel, payload }, '*');
  }

  reset() {
    this.listeners = {};
    this.isConnected = false;
  }

  destroy() {
    this.listeners = {};
    window.removeEventListener('message', this.receiveMessage);
  }
}
