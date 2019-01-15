import React from 'react';

import Bar from './bar';

class PlayControls {
  static name = 'play-controls';

  static initStore() {
    return {
      play: false,
    };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;
    this.client.addListener('play', (evt, payload) => this.play());
    this.client.addListener('stop', (evt, payload) => this.stop());
  }

  play() {
    this.store.set('play', true);
  }

  stop() {
    this.store.set('play', false);
  }

  reset() {
    const controls = this.client.getPlugin('controls');
    if (controls) {
      controls.reset();
    }
  }

  changeState(play) {
    this.client.sendMessage('change-play-state', play);
  }

  header(position) {
    if (position === 'left') {
      const BarWithStore = this.store.withStore(Bar);
      return (
        <BarWithStore
          changeState={p => this.changeState(p)}
          refresh={() => this.client.refresh()}
          reset={() => this.reset()}
          key="play-controls"
        />
      );
    }
  }
}

export default PlayControls;
