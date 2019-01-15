class PerformancePlugin {
  constructor(client) {
    this.client = client;
    this.frames = 0;
    this.previousPerformanceUpdate = (performance || Date).now();
  }

  connect() {
    // Setup client
    this.client.startFrame = this.startFrame.bind(this);
    this.client.endFrame = this.endFrame.bind(this);
  }

  startFrame() {
    this.startFrameTime = (performance || Date).now();
  }

  endFrame() {
    this.frames++;
    const time = (performance || Date).now();

    // inspired by:
    // https://github.com/mrdoob/stats.js/

    if (
      time >= this.previousPerformanceUpdate + 1000 ||
      !this.previousPerformanceUpdate
    ) {
      this.client.sendMessage('FPS', {
        fps: (this.frames * 1000) / (time - this.previousPerformanceUpdate),
        ms: time - this.startFrameTime,
        memory: {
          size: performance.memory.usedJSHeapSize / 1048576,
          limit: performance.memory.jsHeapSizeLimit / 1048576,
        },
      });

      // Reset
      this.frames = 0;
      this.previousPerformanceUpdate = time;
    }
  }
}

export default PerformancePlugin;
