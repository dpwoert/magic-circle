type hook = (channel: string, ...payload: any[]) => void;

export class IpcBase {
  private listeners: Record<string, hook[]>;

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
      this.listeners[channel] = [];
    }

    this.listeners[channel].push(fn);
  }

  once(channel: string, fn: hook) {
    const handler = (payload: any) => {
      fn(payload, channel);
      this.removeListener('channel', handler);
    };

    this.on(channel, handler);
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
    window.addEventListener('message', (evt) => {
      if (evt.data && evt.data.channel) {
        this.trigger(evt.data.channel, evt.data.payload);
      }
    });
  }

  async connect() {
    return new Promise<boolean>((resolve) => {
      if (this.mode === IframeMode.CHILD) {
        if (this.isConnected) {
          resolve(true);
          return;
        }

        this.once('connect', () => {
          this.isConnected = true;
          resolve(true);
          this.send('connect', true);
        });
      } else {
        this.send('connect', true);
        this.once('connect', () => {
          this.isConnected = true;
          resolve(true);
        });
      }
    });
  }

  send(channel: string, ...payload: any[]) {
    this.connection.postMessage({ channel, payload }, '*');
  }
}
