/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import React from 'react';
// import fs frxom 'fs';
// import { promisify } from 'util';
import path from 'path';

import MidiPanel from './panel';

// const readFile = promisify(fs.readFile);
// const writeFile = promisify(fs.writeFile);

class Midi {
  static name = 'midi';

  static electronOnly = true;

  static initStore() {
    return {
      presets: [{ label: '', config: [] }],
      active: {
        preset: 0,
        row: null,
      },
    };
  }

  constructor(client, store, settings) {
    this.client = client;
    this.store = store;

    // default settings
    settings.midi = Object.assign(
      {
        path: path.join(this.client.cwd, 'midi.json'),
      },
      settings.midi
    );

    this.path = this.client.getSetting('midi.path');
  }

  addRow() {
    const presets = this.store.get('presets');
    const active = this.store.get('active').preset;
    presets[active].config.push({
      id: Date.now(),
      midi: '',
      key: '',
    });

    this.store.set('presets', presets);
  }

  save() {}

  reset() {}

  applicationMenu() {
    return [
      {
        label: 'Next preset',
        // accelerator: 'Command+A',
        click: () => {
          // todo
        },
      },
      {
        label: 'Previous preset',
        click: () => {
          // todo
        },
      },
    ];
  }

  sidebar() {
    const Panel = this.store.withStore(MidiPanel);
    return <Panel path={this.path} addRow={() => this.addRow()} key="midi" />;
  }
}

export default Midi;
