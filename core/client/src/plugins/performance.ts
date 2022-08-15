/* eslint-disable no-unsafe-optional-chaining */
import type Control from '../control';
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
  stats: {
    fps: number;
    renderTime: number;
    memory?: number;
  };

  name = 'performance';

  constructor(client: Plugin['client']) {
    super(client);

    this.frames = 0;
    this.previousPerformanceUpdate = (performance || Date).now();
    this.loadMetrics = {};
    this.stats = { fps: 0, renderTime: 0 };

    this.getLoadMetrics = this.getLoadMetrics.bind(this);
    window.addEventListener('load', this.getLoadMetrics);
  }

  getLoadMetrics() {
    if (performance && performance.getEntriesByType) {
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
    if (this.client.ipc) {
      this.client.ipc.send('performance:loading', this.loadMetrics);
    }
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
      const memory =
        // @ts-expect-error
        'memory' in performance ? performance.memory.usedJSHeapSize : null;

      this.stats = {
        fps: (this.frames * 1000) / (time - this.previousPerformanceUpdate),
        renderTime: time - this.startFrameTime,
        memory: memory ? memory / 1048576 : null,
      };

      if (this.client.ipc) {
        this.client.ipc.send('performance:fps', this.stats);
      }

      // Reset
      this.frames = 0;
      this.previousPerformanceUpdate = time;
    }
  }

  destroy() {
    window.removeEventListener('load', this.getLoadMetrics);
  }
}
