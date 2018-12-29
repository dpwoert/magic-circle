import React from 'react';

import PerformancePanel from './panel';

class Performance {

  static name = 'performance';

  static initStore(){
    return {
      FPS: 0,
      memorySize: 0,
      memoryLimit: 0,
    };
  }

  constructor(client, store){
    this.client = client;
    this.store = store;
    this.client.addListener('FPS', (evt, payload) => this.tick(payload));
  }

  tick(tick){
    this.store.set('FPS', Math.floor(tick.fps));
    this.store.set('ms', Math.ceil(tick.ms*10));
    this.store.set('memorySize', Math.floor(tick.memory.size));
    this.store.set('memoryLimit', Math.floor(tick.memory.limit));
  }

  sidebar(){
    const Panel = this.store.withStore(PerformancePanel);
    return (
      <Panel key="performance" />
    );
  }

}

export default Performance;
