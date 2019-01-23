import React from 'react';
import fs from 'fs';

import Bar from './bar';
import ScreenshotsPanel from './panel';

class Screenshots {
  static name = 'screenshots';

  static electronOnly = true;

  static initStore() {
    return { screenshots: [] };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;
    this.refresh();
    this.client.addListener('screenshot-taken', () => this.refresh());
    this.deleteScreenshot = this.deleteScreenshot.bind(this);
    this.loadScreenshot = this.loadScreenshot.bind(this);
  }

  electron() {
    return `${__dirname}/electron.js`;
  }

  header(position) {
    if (position === 'left') {
      return (
        <Bar
          takeScreenshot={p => this.takeScreenshot(p)}
          key="screenshot-control"
        />
      );
    }

    return false;
  }

  refresh() {
    // load all screenshots
    const files = fs
      .readdirSync(`${this.client.cwd}/screenshots`)
      .filter(f => f.substr(f.lastIndexOf('.') + 1) === 'json')
      .map(f => f.replace('.json', ''));

    this.store.set('screenshots', files);
  }

  loadScreenshot(file) {
    let data = fs.readFileSync(`${this.client.cwd}/screenshots/${file}.json`);
    data = JSON.parse(data);

    if (data.changelog) {
      const controls = this.client.getPlugin('controls');
      controls.reset();
      controls.applyChangelog(this.client.JSONToMap(data.changelog));
    }
    if (data.seed) {
      const seed = this.client.getPlugin('seed');
      seed.setSeed(data.seed, true);
    }
  }

  deleteScreenshot(file) {
    fs.unlinkSync(`${this.client.cwd}/screenshots/${file}.json`);
    this.refresh();
  }

  takeScreenshot() {
    const changelog = this.createChangelog
      ? this.client.mapToJSON(this.client.createChangelog())
      : [];
    const seed = this.getSeed ? this.getSeed() : null;
    const data = { changelog, seed };
    this.client.sendAction('screenshot', data);
  }

  sidebar() {
    const Panel = this.store.withStore(ScreenshotsPanel);
    return (
      <Panel
        deleteScreenshot={this.deleteScreenshot}
        loadScreenshot={this.loadScreenshot}
        resize={this.client.resize}
        path={`${this.client.cwd}/screenshots`}
        key="screenshots"
      />
    );
  }
}

export default Screenshots;
