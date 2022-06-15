import Plugin from '../plugin';

export default class PluginScreenshot extends Plugin {
  element?: HTMLCanvasElement;

  name = 'screenshot';

  connect() {
    const { ipc } = this.client;

    // listen to events
    ipc.on('screenshot:take', () => this.screenshot());
  }

  async screenshot() {
    if (!this.element) {
      // eslint-disable-next-line
      alert('This plugin is not configured yet');
    }

    requestAnimationFrame(() => {
      // Get image
      const dataUrl: string = this.element.toDataURL('image/png', 1);
      this.client.ipc.send('screenshot:save', dataUrl);
    });
  }

  setupIframeElement(canvas: HTMLCanvasElement) {
    this.element = canvas;
    return this;
  }
}
