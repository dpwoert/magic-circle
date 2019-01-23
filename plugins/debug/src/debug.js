import React from 'react';

import Bar from './bar';

class Debug {
  static name = 'debug';

  static electronOnly = true;

  constructor(client) {
    this.client = client;
  }

  electron() {
    return `${__dirname}/electron.js`;
  }

  header(position) {
    if (position === 'left') {
      return (
        <Bar toggleDebugger={() => this.devTools()} key="debugger-control" />
      );
    }

    return false;
  }

  devTools() {
    const mode = this.client.getSetting('debug.devTools');
    this.client.sendAction('dev-tools', { mode });
  }
}

export default Debug;
