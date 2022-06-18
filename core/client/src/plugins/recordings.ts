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
    this.client.element.style.position = `fixed`;
    this.client.element.style.height = `${options.height}px`;
    this.client.element.style.width = `${options.width}px`;
    this.client.element.setAttribute('width', String(options.width));
    this.client.element.setAttribute('height', String(options.height));

    // Start!
    this.next();
  }

  async next() {
    // Get next frame
    const delta = this.options.fps / 1000;
    this.client.tick(delta);

    const plugin = this.client.plugin('screenshot') as PluginScreenshot;

    if (!plugin) {
      throw new Error('Plugin screenshot is not loaded');
    }

    // Get and send
    const screenshot = await plugin.screenshot();
    console.log({ screenshot });
    this.client.ipc.send('recordings:save', screenshot);
  }

  stop() {
    location.reload();
  }
}
