import { Plugin, App, icons } from '@magic-circle/schema';
import { Store } from '@magic-circle/state';
import { registerIcon, VideoCamera } from '@magic-circle/styles';
import ScreenshotPlugin from '@magic-circle/screenshots';

import Sidebar from './Sidebar';

registerIcon(VideoCamera);

type ScreenshotExport = {
  data: string;
  type: 'png' | 'svg';
};

type CurrentData = {
  width: number;
  height: number;
  fps: number;
  duration: number;
  frame: number;
  directory: any;
  isRecording: boolean;
};

export default class Recordings implements Plugin {
  ipc: App['ipc'];
  client: App;
  screenshots: ScreenshotPlugin;

  current: Store<CurrentData>;

  name = 'recordings';

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;

    this.current = new Store<CurrentData>({
      width: 1080,
      height: 720,
      fps: 30,
      duration: 15,
      frame: 0,
      directory: null,
      isRecording: false,
    });

    this.ipc.on('recordings:save', (_, data: ScreenshotExport) => {
      this.saveScreenshot(data);
    });
  }

  sidebar() {
    return {
      icon: 'VideoCamera' as icons,
      name: 'screenshots',
      render: <Sidebar recordings={this} />,
    };
  }

  async start() {
    this.screenshots = this.client.getPlugin('screenshots') as ScreenshotPlugin;

    if (!this.screenshots) {
      throw new Error(
        'The screenshot plugin is needed to use the recordings plugin'
      );
    }

    // create directory
    const base = await this.screenshots.getDirectory();
    const permission = await this.screenshots.verifyPermission(base, false);

    if (!permission) {
      // todo do something
      return;
    }

    // Get date for directory
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const time = `${now.getHours()}.${now.getMinutes()}`;
    const fileName = `${date} ${time}`;

    const directory = await base.getDirectoryHandle(`recording ${fileName}`, {
      create: true,
    });

    if (!directory) {
      // todo do something
      return;
    }

    this.current.set({
      ...this.current.value,
      isRecording: true,
      frame: 0,
      directory,
    });

    // start recording
    const { width, height, fps } = this.current.value;
    this.ipc.send('recordings:start', {
      width,
      height,
      fps,
    });
  }

  next() {
    this.current.set({
      ...this.current.value,
      frame: this.current.value.frame + 1,
    });

    // see if we went over the time
    const { duration, fps, frame } = this.current.value;
    const maxFrames = duration * fps;

    if (frame < maxFrames) {
      this.ipc.send('recordings:next');
    } else {
      this.finish();
    }
  }

  async finish() {
    const { directory, duration, fps, width, height } = this.current.value;
    const maxFrames = duration * fps;
    const digits = String(maxFrames).length;

    // create script file
    const script = `ffmpeg -r ${fps} -f image2 -s ${width}x${height} -i frame-%0${digits}d.png -vcodec libx264 -crf 15  -pix_fmt yuv420p "recording.mp4"`;

    // Save file
    const fileHandle = await directory.getFileHandle(`convert.sh`, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(script);
    await writable.close();
  }

  async saveScreenshot(data: ScreenshotExport) {
    // save screenshot
    const { directory, duration, fps, frame } = this.current.value;
    const maxFrames = duration * fps;
    const digits = String(maxFrames).length;
    const number = String(frame).padStart(digits, '0');

    await this.screenshots.saveScreenshotTo(
      directory,
      `frame-${number}`,
      data,
      false
    );

    requestAnimationFrame(() => {
      this.next();
    });
  }
}
