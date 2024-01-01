import Plugin from '../plugin';
import PluginScreenshot from './screenshots';

type Recording = {
  width: number;
  height: number;
  fps: number;
};

export default class PluginRecordings extends Plugin {
  name = 'recordings';

  options?: Recording;

  connect() {
    const { ipc } = this.client;

    if (!ipc) {
      throw new Error('IPC not defined');
    }

    // listen to events
    ipc.on('recordings:start', (_, options: Recording) => {
      this.start(options);
    });
    ipc.on('recordings:next', () => {
      this.next();
    });
    ipc.on('recordings:stop', () => {
      this.stop();
    });
  }

  async start(options: Recording) {
    // Make sure to stop
    this.client.stop();

    // set options
    this.options = options;

    // Resize
    const resizeFn = this.client.resize();

    if (resizeFn) {
      resizeFn(options.width, options.height, this.client.element);
    } else if (this.client.element) {
      this.client.element.style.position = `fixed`;
      this.client.element.style.height = `${options.height}px`;
      this.client.element.style.width = `${options.width}px`;
      this.client.element.setAttribute('width', String(options.width));
      this.client.element.setAttribute('height', String(options.height));
    }

    // Start!
    this.next();
  }

  async next() {
    // Get next frame
    const delta = (this.options?.fps || 60) / 1000;
    this.client.step(delta);

    const plugin = this.client.plugin('screenshot') as PluginScreenshot;

    if (!plugin) {
      throw new Error('Plugin screenshot is not loaded');
    }

    // Get and send
    const screenshot = await plugin.screenshot();

    if (this.client.ipc) {
      this.client.ipc.send('recordings:save', screenshot);
    }
  }

  stop() {
    location.reload();
  }
}
