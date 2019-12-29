/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import React from 'react';
// import fs frxom 'fs';
// import { promisify } from 'util';
import path from 'path';
import WebMidi from 'webmidi';

import MidiPanel from './panel';

// const readFile = promisify(fs.readFile);
// const writeFile = promisify(fs.writeFile);

class Midi {
  static name = 'midi';

  static electronOnly = true;

  static initStore() {
    return {
      presets: [{ label: '', config: [], input: null }],
      active: 0,
      inputs: [],
    };
  }

  static standaloneSettings(settings) {
    return {
      ...settings,
      path: null,
    };
  }

  static defaultSettings(client) {
    return {
      path: path.join(client.cwd, 'midi.json'),
    };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;
    this.path = this.client.getSetting('midi.path');

    // start listening to midi messages
    this.midiStart();
  }

  midiStart() {
    WebMidi.enable(err => {
      if (err) {
        console.error('Error when enabling midi', err);
      }

      WebMidi.inputs.forEach(input => {
        input.addListener('noteon', 'all', e => {
          console.log("Received 'noteon' message", e);

          const command = {
            note: e.note,
            channel: e.channel,
            velocity: e.velocity,
            type: e.type,
          };

          if (this.store.get('once')) {
            this.store.get('once')(command);
            this.store.set('once', null);
          }
        });
      });
    });
  }

  addRow() {
    const presets = this.store.get('presets');
    const active = this.store.get('active');
    presets[active].config.push({
      id: Date.now(),
      midi: null,
      path: null,
    });

    this.store.set('presets', presets);
  }

  updateRow(id, key, value, path) {
    const presets = this.store.get('presets');
    const active = this.store.get('active');

    const row = presets[active].config.find(r => r.id === id);
    row[key] = value;

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
    const { connect } = this.client.getPlugin('controls');
    return (
      <Panel
        path={this.path}
        addRow={() => this.addRow()}
        updateRow={this.updateRow.bind(this)}
        connect={connect}
        key="midi"
      />
    );
  }
}

export default Midi;
