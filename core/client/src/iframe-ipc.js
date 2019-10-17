export class IframeIPC {
  constructor() {
    this.listeners = [];

    window.addEventListener('message', evt => {
      if (evt.data && evt.data.channel) {
        this.trigger(evt.data.channel, evt, evt.data.payload);
      }
    });
  }

  findParent() {
    if (window.parent) {
      this.mode = 'child';
      this.connection = window.parent;
    }
  }

  selector(selector = 'iframe') {
    this.mode = 'parent';
    this.iframe = null;
    this.parent = null;

    window.addEventListener('load', () => {
      const iframe = document.querySelector(selector);

      if (!iframe) {
        throw new Error("can't find iframe element");
      }

      this.connection = iframe.contentWindow;
      this.send('editor-ready', true);
    });
  }

  send(channel, payload) {
    if (this.connection) {
      if (channel === 'intercom') {
        this.connection.postMessage({ ...payload });
      } else {
        this.connection.postMessage({ channel, payload });
      }
    } else {
      console.warn('could not send message', channel, payload);
    }
  }

  trigger(channel, evt, payload) {
    this.listeners = this.listeners
      .map(l => {
        if (l.channel === channel) {
          l.fn(evt, payload);
          return l.once ? { ...l, remove: true } : l;
        }
        return l;
      })
      .filter(l => !l.remove);
  }

  on(channel, fn) {
    this.listeners.push({
      channel,
      fn,
      once: false,
    });
  }

  once(channel, fn) {
    this.listeners.push({
      channel,
      fn,
      once: true,
    });
  }

  removeListener(channel, fn) {
    this.listeners = this.listeners.filter(
      l => !(l.fn === fn && l.channel === channel)
    );
  }

  removeAllListeners(channel) {
    this.listeners = this.listeners.filter(l => l.channel !== channel);
  }
}
