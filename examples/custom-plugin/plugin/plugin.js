class Test {
  static name = 'test';

  static electronOnly = true;

  constructor(client) {
    this.client = client;
    console.info('test running');
  }

  electron() {
    return `${__dirname}/electron.js`;
  }

  buttons(buttons) {
    buttons.set('test', {
      icon: 'Debug',
      collection: 'test',
      click: () => {},
      touchbar: false,
    });
  }
}

export default Test;
