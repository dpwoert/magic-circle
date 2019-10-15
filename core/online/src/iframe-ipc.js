class IframeIPC {
  constructor(selector = 'iframe') {
    this.listeners = [];
    this.selector = selector;
    this.iframe = null;

    document.addEventListener('load', () => {
      const iframe = document.querySelector(selector);
      if (!iframe) {
        throw new Error("can't find iframe element");
      }

      this.iframe = iframe.contentWindow;
      this.iframe.addEventListener('load', () => {
        console.log('load');
      });
    });
  }

  send(channel, payload) {
    // todo
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
      once: false,
    });
  }

  removeListener(channel, fn) {
    // todo
  }

  removeAllListeners(channel) {}
}

export default IframeIPC;
