import React from 'react';
import fs from 'fs';

import Bar from './bar';
import ScreenshotsPanel from './panel';

class Screenshots {

  static name = 'screenshots';

  static electronOnly = true;

  static initStore(){
    return { screenshots: [] };
  }

  constructor(client, store){
    this.client = client;
    this.store = store;
    this.refresh();
    this.client.addListener('screenshot-taken', () => this.refresh());
    this.deleteScreenshot = this.deleteScreenshot.bind(this);
    this.loadScreenshot = this.loadScreenshot.bind(this);
  }

  header(position){
    if(position === 'left'){
      return (
        <Bar
          takeScreenshot={(p) => this.client.takeScreenshot(p)}
          key="screenshot-control"
        />
      );
    }
  }

  refresh(){
    // load all screenshots
    const re = /(?:\.([^.]+))?$/;
    const files = fs
      .readdirSync(`${this.client.cwd}/screenshots`)
      .filter(f => f.substr(f.lastIndexOf('.') + 1) === 'json')
      .map(f => f.replace('.json', ''));

    this.store.set('screenshots', files)
  }

  loadScreenshot(file){
    let data = fs.readFileSync(`${this.client.cwd}/screenshots/${file}.json`);
    data = JSON.parse(data);

    if(data.layers){
      const layers = this.client.getPlugin('layers');
      const controls = this.client.getPlugin('controls');
      layers.setLayers(data.layers);
      console.log('LAYERS update', data.layers);
      // controls.resync();
    }
    if(data.seed){
      const seed = this.client.getPlugin('seed');
      seed.setSeed(data.seed, true);
    }
  }

  deleteScreenshot(file){
    fs.unlinkSync(`${this.client.cwd}/screenshots/${file}.json`);
    this.refresh();
  }

  sidebar(){
    const Panel = this.store.withStore(ScreenshotsPanel);
    return (
      <Panel
        deleteScreenshot={this.deleteScreenshot}
        loadScreenshot={this.loadScreenshot}
        path={`${this.client.cwd}/screenshots`}
        key="screenshots"
      />
    );
  }

}

export default Screenshots;
