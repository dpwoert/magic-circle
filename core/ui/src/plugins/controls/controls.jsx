import React from 'react';

import ControlPanel from './panel.jsx';

class Controls {

  constructor(client){
    this.client = client;
    this.changelog = new Map();
    this.updateControl = this.updateControl.bind(this);
  }

  setup(){
    const updates = [];

    // batch updates to controls containing initial values
    this.changelog.forEach((value, path) => {
      updates.push({
        channel: 'control-set-value',
        payload: {
          value,
          path
        }
      });
    });

    return updates;
  }

  layout(){
    return <ControlPanel updateControl={this.updateControl} />
  }

  updateControl(path, value){
    this.client.sendMessage('control-set-value', { path, value });
    this.changelog.set(path, value);
  }

}

export default Controls;
