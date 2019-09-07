class Fullscreen {
  static name = 'fullscreen';

  static electronOnly = true;

  static defaultSettings(client) {
    return {
      button: 'editor',
      startup: false,
      frame: true,
      editor: true,
    };
  }

  constructor(client) {
    this.client = client;

    if (this.client.getSetting('fullscreen.startup')) {
      this.toggleFullscreen();
    }
  }

  electron() {
    return '@magic-circle/fullscreen/src/electron.js';
  }

  buttons(buttons) {
    buttons.set('fullscreen', {
      icon: 'Fullscreen',
      collection: 'frame',
      click: () => this.toggleFullscreen(),
      touchbar: false,
    });
  }

  toggleFullscreen() {
    if (this.client.getSetting('fullscreen.button') === 'editor') {
      this.client.sendAction('fullscreen-window');
    } else {
      this.client.sendAction('fullscreen-frame');
    }
  }
}

export default Fullscreen;
