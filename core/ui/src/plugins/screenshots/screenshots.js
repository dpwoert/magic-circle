import React from 'react';

import Bar from './bar';
import ScreenshotsPanel from './panel';

class Screenshots {

  constructor(client){
    this.client = client;
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

  sidebar(){
    return <ScreenshotsPanel key="screenshots" />
  }

}

export default Screenshots;
