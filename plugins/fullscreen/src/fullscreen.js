class Debug {
  static name = 'fullscreen';

  static electronOnly = true;

  constructor(client) {
    this.client = client;

    if (client.getSetting('fullscreen.startup')) {
      this.toggleFullscreen();
    }
  }

  // electron() {
  //   return `${__dirname}/electron.js`;
  // }

  buttons(buttons) {
    buttons.set('fullscreen', {
      icon: 'Fullscreen',
      collection: 'frame',
      click: () => this.toggleFullscreen(),
      touchbar: false,
    });
  }

  toggleFullscreen() {
    this.client.sendAction('fullscreen-frame');
  }
}

export default Debug;
