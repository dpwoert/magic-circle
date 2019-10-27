import React from 'react';
import shallowEqual from 'shallowequal';

import ControlPanel from './panel';
import withControls from './with-controls';

import defaultControls from './components';

class Controls {
  static name = 'controls';

  constructor(client, store, settings) {
    this.client = client;
    this.getControl = this.getControl.bind(this);
    this.updateControl = this.updateControl.bind(this);

    // list of controls
    this.controls = settings.controls
      ? settings.controls(defaultControls)
      : defaultControls;

    this.client.addListener('connect', () => this.presetup());
  }

  presetup() {
    this.changelog = this.createChangelog();
  }

  setup() {
    const updates = [];

    // batch updates to controls containing initial values
    if (this.changelog) {
      this.changelog.forEach((value, path) => {
        updates.push({
          channel: 'control-set-value',
          payload: {
            value,
            path,
          },
        });
      });

      this.changelog = undefined;
    }

    // ensures editor syncs again after
    updates.push({
      channel: 'resync',
      payload: {},
    });

    return this.client.getSetting('noHydrate') ? [] : updates;
  }

  createChangelog(full) {
    const { store } = this.client.getPlugin('layers');
    const mapping = store.get('mapping');

    // clear previous changelog
    const changelog = new Map();

    // diff
    mapping.forEach(c => {
      if (
        c.isControl &&
        (!shallowEqual(c.value, c.initialValue) || full) &&
        !c.noHydrate
      ) {
        changelog.set(c.path, c.value);
      }
    });

    return changelog;
  }

  applyChangelog(changelog) {
    const updates = [];

    // batch updates to controls containing initial values
    changelog.forEach((value, path) => {
      updates.push({
        channel: 'control-set-value',
        payload: {
          value,
          path,
        },
      });
    });

    this.client.sendMessage('batch', {
      batch: updates,
    });
    this.client.sendMessage('resync');
  }

  reset() {
    const updates = [];

    this.createChangelog().forEach((value, path) => {
      updates.push({
        channel: 'control-reset',
        payload: { path },
      });
    });

    this.client.sendMessage('batch', {
      batch: updates,
    });

    this.client.sendMessage('resync');
  }

  getControl(name) {
    return this.controls.find(c => name === c.type);
  }

  updateControl(path, value) {
    this.client.sendMessage('control-set-value', { path, value });

    // save to store
    const { store } = this.client.getPlugin('layers');
    const mapping = store.get('mapping');
    const control = mapping.get(path);
    control.value = value;
    mapping.set(path, control);
    store.set('mapping', mapping);
  }

  layout() {
    const { store } = this.client.getPlugin('layers');
    if (store) {
      const Panel = withControls(ControlPanel, store);
      return (
        <Panel
          getControl={this.getControl}
          updateControl={this.updateControl}
        />
      );
    }

    return null;
  }
}

export default Controls;
