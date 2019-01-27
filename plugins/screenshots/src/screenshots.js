/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */

import React from 'react';
import fs from 'fs';
import { promisify } from 'util';

import Bar from './bar';
import ScreenshotsPanel from './panel';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

const memoize = dirName => {
  const cache = {};

  return async fileName => {
    if (!cache[fileName]) {
      const file = await readFile(`${dirName}/${fileName}`);
      cache[fileName] = JSON.parse(file);
    }
    return cache[name];
  };
};

class Screenshots {
  static name = 'screenshots';

  static electronOnly = true;

  static initStore() {
    return { screenshots: [] };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;

    this.client.addListener('screenshot-taken', () => this.refresh());
    this.deleteScreenshot = this.deleteScreenshot.bind(this);
    this.loadScreenshot = this.loadScreenshot.bind(this);
    this.renameScreenshot = this.renameScreenshot.bind(this);

    this.fileCache = memoize(`${this.client.cwd}/screenshots`);
    this.refresh();
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

  async refresh() {
    // load all screenshots
    const screenshots = [];
    const files = await readdir(`${this.client.cwd}/screenshots`);

    for (let i = 0; i < files.length; i += 1) {
      const ext = files[i].substr(files[i].lastIndexOf('.') + 1);
      if (ext === 'json') {
        const data = await this.fileCache(files[i]);
        data.fileName = files[i].replace('.json', '');
        screenshots.push(data);
      }
    }

    this.store.set('screenshots', screenshots);
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

  deleteScreenshot(screenshot) {
    if (confirm('Are you sure you want to delete this screenshot?')) {
      fs.unlinkSync(
        `${this.client.cwd}/screenshots/${screenshot.fileName}.json`
      );
      this.refresh();
    }
  }

  async renameScreenshot(fileName, name) {
    const data = await this.fileCache(`${fileName}.json`);
    data.meta.name = name;

    const file = `${this.client.cwd}/screenshots/${fileName}.json`;
    await writeFile(file, JSON.stringify(data));
    await this.refresh();
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
        renameScreenshot={this.renameScreenshot}
        loadScreenshot={this.loadScreenshot}
        resize={this.client.resize}
        path={`${this.client.cwd}/screenshots`}
        key="screenshots"
      />
    );
  }
}

export default Screenshots;
