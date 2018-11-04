import React from 'react';

import {updateSeed} from './with-seed.jsx';
import Bar from './bar.jsx';

class Seed {

  constructor(client){
    this.client = client;
    this.client.addListener('seed', (evt, payload) => this.setSeed(payload));
  }

  setSeed(seed){
    updateSeed(seed);
  }

  refresh(){
    this.client.sendMessage('generate-seed');
    console.log('refresh');
  }

  header(position){
    if(position === 'right'){
      return <Bar key="seed" refresh={() => this.refresh()} />;
    }
  }

}

export default Seed;
