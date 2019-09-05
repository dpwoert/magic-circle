/* eslint-disable class-methods-use-this */
import React from 'react';
import path from 'path';

import RecordingsPanel from './panel';

class Recordings {
  static name = 'recordings';

  static electronOnly = true;

  static initStore() {
    return {
      total: 0,
      done: 0,
      converting: false,
      finishedRecording: false,
      finishedConverting: false,
    };
  }

  static defaultSettings(client) {
    return {
      path: path.join(client.cwd, 'recordings'),
      resolutions: ['1280x720', '1920x1080', '2560x1440', '3840x2160'],
    };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;

    this.client.addListener('recording-status', (evt, payload) =>
      this.update(payload)
    );
    this.client.addListener('finished-recording', () =>
      this.finished('recording')
    );
    this.client.addListener('finished-converting', () =>
      this.finished('converting')
    );
    this.path = this.client.getSetting('recordings.path');
    this.startRecording = this.startRecording.bind(this);
    this.resize = this.resize.bind(this);
    this.convert = this.convert.bind(this);
  }

  electron() {
    return `${__dirname}/electron.js`;
  }

  update(data) {
    this.store.set('total', +data.total);
    this.store.set('done', +data.done);
  }

  finished(type) {
    if (type === 'recording') {
      this.store.set('finishedRecording', true);
    } else if (type === 'converting') {
      this.store.set('finishedConverting', true);
      this.store.set('converting', false);
    }
  }

  resize(settings) {
    this.client.resize('frame', settings.width, settings.height);
    this.client.refresh();
  }

  startRecording(settings) {
    this.client.sendAction('record', settings);
  }

  convert(settings) {
    this.store.set('converting', true);
    this.client.sendAction('convert-recording', settings);
  }

  sidebar() {
    const Panel = this.store.withStore(RecordingsPanel);
    return (
      <Panel
        startRecording={this.startRecording}
        convert={this.convert}
        resize={this.resize}
        resolutions={this.client.getSetting('recordings.resolutions')}
        key="record"
      />
    );
  }
}

export default Recordings;
