import React from 'react';

import {updateInfo} from './with-page-info';
import Title from './title';

class Seed {

  static name = 'page-information';

  static initStore(){
    return {
      title: '',
      nodeEnv: 'development',
    };
  }

  constructor(client, store){
    this.client = client;
    this.store = store;
    this.client.addListener('page-information', (evt, payload) => this.setPageInfo(payload));
  }

  setPageInfo(info){
    this.store.set(info)
  }

  header(position){
    if(position === 'center'){
      const TitleWithStore = this.store.withStore(Title);
      return <TitleWithStore key="title" />;
    }
  }

}

export default Seed;
