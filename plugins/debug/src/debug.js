import React from 'react';

import Bar from './bar';

class Debug {
  static name = 'debug';

  static electronOnly = true;

  constructor(client) {
    this.client = client;
  }

  header(position) {
    if (position === 'left') {
      return (
        <Bar
          toggleDebugger={() => this.client.devTools()}
          key="debugger-control"
        />
      );
    }

    return false;
  }
}

export default Debug;
