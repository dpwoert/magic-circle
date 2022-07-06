/* eslint-disable no-async-promise-executor */
import Plugin from '../plugin';

type screenshot = {
  data: string;
  type: 'png' | 'svg';
};

export default class PluginScreenshot extends Plugin {
  name = 'screenshot';

  connect() {
    const { ipc } = this.client;

    // listen to events
    ipc.on('screenshot:take', () => {
      this.saveScreenshot();
    });
  }

  screenshot(): Promise<screenshot> {
    return new Promise(async (resolve, reject) => {
      if (!this.client.element) {
        // eslint-disable-next-line
        alert('This plugin is not configured correctly yet');
        reject();
        return;
      }

      if (this.client.element.tagName === 'svg') {
        resolve({
          data: this.client.element.outerHTML,
          type: 'svg',
        });
      }

      if ('toDataURL' in this.client.element) {
        requestAnimationFrame(() => {
          // Get image
          // @ts-expect-error
          const dataUrl: string = this.client.element.toDataURL('image/png', 1);
          resolve({
            data: dataUrl,
            type: 'png',
          });
        });
      }
    });
  }

  async saveScreenshot() {
    const screenshot = await this.screenshot();
    this.client.ipc.send('screenshot:save', screenshot);
  }
}
