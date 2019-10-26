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
    this.client.refresh();
  }

  changeState(play) {
    this.client.sendMessage('change-play-state', play);
  }

  buttons(buttons) {
    this.store.addListener(data => {
      buttons.set('play', {
        icon: data.play ? 'Pause' : 'Play',
        collection: 'play',
        click: () => this.changeState(!data.play),
      });
      buttons.set('reload', {
        icon: 'Reload',
        collection: 'play',
        click: () => this.client.refresh(),
      });
      buttons.set('rewind', {
        icon: 'Rewind',
        collection: 'play',
        click: () => this.reset(),
        touchbar: false,
      });
    });
  }
}

export default PlayControls;
