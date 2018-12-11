import React from 'react';

import {updateSeed, getSeed} from './with-seed';
import Bar from './bar';

class Seed {

  static name = 'seed';

  static initStore(){
    return {
      seed: 0
    };
  }

  constructor(client, store){
    this.client = client;
    this.store = store;
    this.client.getSeed = this.getSeed.bind(this);
    this.client.addListener('seed', (evt, payload) => this.setSeed(payload));
  }

  setSeed(seed, update){
    this.store.set('seed', seed);

    if(update){
      this.client.sendMessage('set-seed', seed);
    }
  }

  refresh(){
    this.client.sendMessage('generate-seed');
  }

  getSeed(){
    return this.store.get('seed');
  }

  header(position){
    if(position === 'right'){
      const BarWithStore = this.store.withStore(Bar);
      return <BarWithStore key="seed" refresh={() => this.refresh()} />;
    }
  }

}

export default Seed;
