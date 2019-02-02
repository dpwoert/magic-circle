import React from 'react';

import Bar from './bar';

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

  header(position) {
    if (position === 'left') {
      return (
        <Bar
          toggleFullscreen={() => this.toggleFullscreen()}
          key="fullscreen-control"
        />
      );
    }

    return false;
  }

  toggleFullscreen() {
    this.client.sendAction('fullscreen-frame');
  }
}

export default Debug;
