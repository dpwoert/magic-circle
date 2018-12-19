import React from 'react';
import shallowEqual from 'shallowequal';

import ControlPanel from './panel';
import withControls from './with-controls';

class Controls {

  static name = 'controls';

  constructor(client){
    this.client = client;
    this.updateControl = this.updateControl.bind(this);
    this.client.createChangelog = this.createChangelog.bind(this);

    this.client.addListener('connect', () => this.presetup());

  }

  presetup(){
    this.changelog = this.createChangelog();
  }

  setup(){
    const updates = [];

    // batch updates to controls containing initial values
    if(this.changelog){
      this.changelog.forEach((value, path) => {
        updates.push({
          channel: 'control-set-value',
          payload: {
            value,
            path
          }
        });
      });

      this.changelog = undefined;
    }

    return updates;
  }

  createChangelog(json){

    const {store} = this.client.getPlugin('layers');
    const mapping = store.get('mapping');

    // clear previous changelog
    const changelog = new Map();

    // diff
    mapping.forEach(c => {
      if(c.isControl && !shallowEqual(c.value,c.initialValue)){
        changelog.set(c.path, c.value);
      }
    });

    return changelog;
  }

  applyChangelog(changelog, json){

    const updates = [];

    // batch updates to controls containing initial values
    changelog.forEach((value, path) => {
      updates.push({
        channel: 'control-set-value',
        payload: {
          value,
          path
        }
      });
    });

    this.client.sendMessage('batch', {
      batch: updates,
    });
    this.client.sendMessage('resync');

  }

  reset(){

    const updates = [];

    this.createChangelog().forEach((value, path) => {
      updates.push({
        channel: 'control-reset',
        payload: { path }
      });
    });


    this.client.sendMessage('batch', {
      batch: updates,
    });

    this.client.sendMessage('resync');

  }

  updateControl(path, value){
    this.client.sendMessage('control-set-value', { path, value });

    // save to store
    const {store} = this.client.getPlugin('layers');
    const mapping = store.get('mapping');
    const control = mapping.get(path);
    control.value = value;
    mapping.set(path, control);
    store.set('mapping', mapping);
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
