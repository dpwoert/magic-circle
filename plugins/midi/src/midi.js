/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import React from 'react';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

import MidiPanel from './panel';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class Midi {
  static name = 'midi';

  static electronOnly = true;

  static initStore() {
    return { presets: [] };
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

  applicationMenu() {
    return [
      {
        label: 'Next preset',
        // accelerator: 'Command+A',
        click: () => {
          //todo
        },
      },
      {
        label: 'Previous preset',
        click: () => {
          //todo
        },
      },
    ];
  }

  sidebar() {
    const Panel = this.store.withStore(MidiPanel);
    return <Panel path={this.path} key="midi" />;
  }
}

export default Midi;
