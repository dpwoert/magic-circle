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
    this.client.addListener('play', () => this.play());
    this.client.addListener('stop', () => this.stop());
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

  buttons(buttons) {
    this.store.addListener(data => {
      buttons.set('play', {
        icon: data.play ? 'Pause' : 'Play',
        collection: 'play',
        onClick: () => this.changeState(!data.play),
      });
      buttons.set('reload', {
        icon: 'Reload',
        collection: 'play',
        onClick: () => this.client.refresh(),
      });
      buttons.set('rewind', {
        icon: 'Rewind',
        collection: 'play',
        onClick: () => this.reset(),
        touchbar: false,
      });
    });
  }
}

export default PlayControls;
