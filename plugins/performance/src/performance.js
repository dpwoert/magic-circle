import React from 'react';

import PerformancePanel from './panel';

const MAX_TICKS = 75;

const updateTick = (store, key, value) => {
  const current = store.get(key);
  current.push(value);

  if (current.length > MAX_TICKS) {
    current.shift();
  }

  store.set(key, current);
};

class Performance {
  static name = 'performance';

  static initStore() {
    return {
      FPS: [],
      ms: [],
      memorySize: [],
      memoryLimit: 0,
    };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;
    this.client.addListener('FPS', (evt, payload) => this.tick(payload));
    this.client.addListener('connect', () => this.restart());
  }

  tick(tick) {
    updateTick(this.store, 'FPS', Math.floor(tick.fps));
    updateTick(this.store, 'ms', Math.ceil(tick.ms * 10));
    updateTick(this.store, 'memorySize', Math.floor(tick.memory.size));
    this.store.set('memoryLimit', Math.floor(tick.memory.limit));
  }

  restart() {
    updateTick(this.store, 'FPS', 'restart');
    updateTick(this.store, 'ms', 'restart');
    updateTick(this.store, 'memorySize', 'restart');
  }

  sidebar() {
    const Panel = this.store.withStore(PerformancePanel);
    return <Panel key="performance" />;
  }
}

export default Performance;
