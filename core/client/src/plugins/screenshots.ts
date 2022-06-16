import Plugin from '../plugin';

export default class PluginScreenshot extends Plugin {
  name = 'screenshot';

  connect() {
    const { ipc } = this.client;

    // listen to events
    ipc.on('screenshot:take', () => this.screenshot());
  }

  async screenshot() {
    console.log('screenshot 1');

    if (!this.client.element || 'toDataURL' in this.client.element === false) {
      // eslint-disable-next-line
      alert('This plugin is not configured correctly yet');
      return;
    }

    console.log('can make screen');

    requestAnimationFrame(() => {
      // Get image
      // @ts-expect-error
      const dataUrl: string = this.client.element.toDataURL('image/png', 1);
      this.client.ipc.send('screenshot:save', dataUrl);
    });
  }
}
