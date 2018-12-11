import React from 'react';

import ControlPanel from './panel';
import withControls from './with-controls';

class Controls {

  static name = 'controls';

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

  updateControl(path, value){
    this.client.sendMessage('control-set-value', { path, value });
    this.changelog.set(path, value);
  }

  resync(){
    console.log('resync');
    //todo diff and send changelog
  }

  layout(){
    const store = this.client.getPlugin('layers').store;
    if(store){
      const Panel = withControls(ControlPanel, store);
      return <Panel updateControl={this.updateControl} />;
    }
  }

}

export default Controls;
