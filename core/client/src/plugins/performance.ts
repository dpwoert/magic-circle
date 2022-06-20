/* eslint-disable no-unsafe-optional-chaining */
import type Control from '../control';
import Paths from '../paths';
import Plugin from '../plugin';

const ensurePaint = (fn: () => void) => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      fn();
    }, 1000);
  });
};

export default class PluginPerformance extends Plugin {
  cache: Record<string, Control<any>>;

  frames: number;
  startFrameTime: number;
  previousPerformanceUpdate: number;
  loadMetrics: {
    firstPaint?: number;
    firstContentfulPaint?: number;
    loadingTime?: number;
  };

  name = 'layers';

  constructor(client: Plugin['client']) {
    super(client);

    this.frames = 0;
    this.previousPerformanceUpdate = (performance || Date).now();
    this.loadMetrics = {};

    window.addEventListener('load', () => this.getLoadMetrics());
  }

  connect() {
    this.sync();
  }

  getLoadMetrics() {
    if (performance) {
      const paint = performance.getEntriesByType('paint');

      this.loadMetrics = {
        firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(
          (p) => p.name === 'first-contentful-paint'
        )?.startTime,
        loadingTime:
          performance.timing.loadEventEnd - performance.timing.responseEnd,
      };
    }

    this.sync();
  }

  playState(playing: boolean) {
    if (playing) {
      ensurePaint(() => this.getLoadMetrics());
    }
  }

  sync() {
    this.client.ipc.send('performance:loading', this.loadMetrics);
  }

  startFrame() {
    this.startFrameTime = (performance || Date).now();
  }

  endFrame() {
    this.frames += 1;
    const time = (performance || Date).now();

    // inspired by:
    // https://github.com/mrdoob/stats.js/

    if (
      time >= this.previousPerformanceUpdate + 1000 ||
      !this.previousPerformanceUpdate
    ) {
      // @ts-expect-error
      const memory = performance?.memory.usedJSHeapSize;

      this.client.ipc.send('performance:fps', {
        fps: (this.frames * 1000) / (time - this.previousPerformanceUpdate),
        renderTime: time - this.startFrameTime,
        memory: memory ? memory / 1048576 : null,
      });

      // Reset
      this.frames = 0;
      this.previousPerformanceUpdate = time;
    }
  }
}
