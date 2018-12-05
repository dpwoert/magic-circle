import React from 'react';

import {updateInfo} from './with-page-info';
import Title from './title';

class Seed {

  constructor(client){
    this.client = client;
    this.client.addListener('page-information', (evt, payload) => this.setPageInfo(payload));
  }

  setPageInfo(seed){
    updateInfo(seed);
  }

  refresh(){
    this.client.sendMessage('generate-seed');
    console.log('refresh');
  }

  header(position){
    if(position === 'center'){
      return <Title key="title" />;
    }
  }

}

export default Seed;
