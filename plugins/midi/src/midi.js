/* eslint-disable no-restricted-globals */
/* eslint-disable spaced-comment */

import React from 'react';
import WebMidi from 'webmidi';

/*#if _WEB
const fs = {};
const promisify = () => {};
const path = {};
//#else */
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
//#endif

import MidiPanel from './panel';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const mapLinear = (x, a1, a2, b1, b2) =>
  b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

class Midi {
  static name = 'midi';

  static electronOnly = true;

  static initStore() {
    return {
      presets: [{ label: '', config: [], input: null }],
      active: 0,
      inputs: [],
      unsavedChanges: false,
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

    this.addRow = this.addRow.bind(this);
    this.updateRow = this.updateRow.bind(this);
    this.save = this.save.bind(this);

    // start listening to midi messages
    this.midiStart();

    // open file with presets
    this.readFile();
  }

  midiStart() {
    WebMidi.enable((err) => {
      if (err) {
        console.error('Error when enabling midi', err);
      }

      // get controls plugin
      const controls = this.client.getPlugin('controls');

      WebMidi.inputs.forEach((input) => {
        input.addListener('noteon', 'all', (e) => {
          const command = {
            device: e.target.name,
            note: e.note,
            channel: e.channel,
            velocity: e.velocity,
            type: e.type,
          };

          // trigger?
          const presets = this.store.get('presets');
          const active = this.store.get('active');
          presets[active].config.forEach((row) => {
            if (
              row.midi &&
              row.midi.channel === e.channel &&
              row.midi.note.number === e.note.number
            ) {
              // get control from path
              const control = controls.getFromPath(row.path);

              // trigger button
              if (control.type === 'button') {
                controls.updateControl(row.path, '');
              }

              // trigger range
              if (control.type === 'number' && control.options.range) {
                const value = mapLinear(
                  e.velocity,
                  0,
                  1,
                  control.options.range[0],
                  control.options.range[1]
                );
                controls.updateControl(row.path, value);
              }
            }
          });

          // one time callback
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
    this.store.set('unsavedChanges', true);
  }

  updateRow(id, key, value) {
    const presets = this.store.get('presets');
    const active = this.store.get('active');

    const row = presets[active].config.find((r) => r.id === id);
    row[key] = value;

    this.store.set('presets', presets);
    this.store.set('unsavedChanges', true);
  }

  async readFile() {
    try {
      const file = await readFile(this.path);

      if (file) {
        this.store.set('presets', JSON.parse(file));
      }
    } catch (e) {
      console.info('No presets for MIDI saved yet');
    }
  }

  async save() {
    const presets = this.store.get('presets');
    await writeFile(this.path, JSON.stringify(presets));
    this.store.set('unsavedChanges', false);
  }

  reset() {
    console.warn('reset not working');
  }

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
        addRow={this.addRow}
        updateRow={this.updateRow}
        connect={connect}
        save={this.save}
        key="midi"
      />
    );
  }
}

export default Midi;
