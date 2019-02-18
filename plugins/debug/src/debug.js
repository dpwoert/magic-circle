class Debug {
  static name = 'debug';

  static electronOnly = true;

  constructor(client) {
    this.client = client;
  }

  electron() {
    return `${__dirname}/electron.js`;
  }

  buttons(buttons) {
    buttons.set('debug', {
      icon: 'Debug',
      collection: 'debug',
      onClick: () => this.devTools(),
      touchbar: false,
    });
  }

  devTools() {
    const mode = this.client.getSetting('debug.devTools');
    this.client.sendAction('dev-tools', { mode });
  }
}

export default Debug;
