/* eslint-disable spaced-comment */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import React from 'react';

/*#if _WEB
const fs = {};
const promisify = () => {};
const path = {};
//#else */
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
//#endif

import ScreenshotsPanel from './panel';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

const memoize = dirName => {
  const cache = {};

  return async fileName => {
    if (!cache[fileName]) {
      const file = await readFile(`${dirName}/${fileName}`);
      cache[fileName] = JSON.parse(
        file.toString ? file.toString('utf8') : file
      );
    }
    return cache[fileName];
  };
};

class Screenshots {
  static name = 'screenshots';

  static electronOnly = true;

  static initStore() {
    return { screenshots: [] };
  }

  static standaloneSettings(settings) {
    return {
      ...settings,
      path: null,
    };
  }

  static defaultSettings(client) {
    return {
      path: path.join(client.cwd, 'screenshots'),
      gitInfo: true,
      resolutions: [
        '800x600',
        '1024x768',
        '1400x768',
        '1080x720',
        '1920x1080',
        '3840×2160',
      ],
    };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;

    this.client.addListener('screenshot-taken', () => this.refresh());
    this.path = this.client.getSetting('screenshots.path');
    this.deleteScreenshot = this.deleteScreenshot.bind(this);
    this.loadScreenshot = this.loadScreenshot.bind(this);
    this.renameScreenshot = this.renameScreenshot.bind(this);

    this.fileCache = memoize(this.path);
    this.refresh();
  }

  electron() {
    // return `${__dirname}/electron.js`;
    return '@magic-circle/screenshots/src/electron.js';
  }

  applicationMenu() {
    return [
      {
        label: 'Take Screenshot',
        accelerator: 'Command+S',
        click: () => this.takeScreenshot(),
      },
      {
        label: 'Show in Finder',
        click: () => {
          //#if !_WEB
          require('electron').shell.openItem(this.path);
          //#endif
        },
      },
    ];
  }

  buttons(buttons) {
    buttons.set('screenshot', {
      icon: 'Screenshot',
      collection: 'frame',
      click: () => this.takeScreenshot(),
    });
  }

  async refresh() {
    const screenshots = [];

    if (fs.existsSync(this.path)) {
      // load all screenshots
      const files = await readdir(this.path);

      for (let i = 0; i < files.length; i += 1) {
        const ext = files[i].substr(files[i].lastIndexOf('.') + 1);
        if (ext === 'json') {
          const data = await this.fileCache(files[i]);
          data.fileName = files[i].replace('.json', '');
          screenshots.push(data);
        }
      }
    }

    this.store.set('screenshots', screenshots);
  }

  loadScreenshot(file) {
    let data = fs.readFileSync(path.join(this.path, `${file}.json`));
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
      fs.unlinkSync(path.join(this.path, `${screenshot.fileName}.json`));
      this.refresh();
    }
  }

  async renameScreenshot(fileName, name) {
    const data = await this.fileCache(`${fileName}.json`);
    data.meta.name = name;

    const file = path.join(this.path, `${fileName}.json`);
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
        path={this.path}
        resolutions={this.client.getSetting('screenshots.resolutions')}
        key="screenshots"
      />
    );
  }
}

export default Screenshots;
