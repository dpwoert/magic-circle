import React from 'react';

import Bar from './bar.jsx';
import ScreenshotsPanel from './panel.jsx';

class Screenshots {

  constructor(client){
    this.client = client;
  }

  takeScreenshot(){
    //tos
  }

  header(position){
    if(position === 'left'){
      return (
        <Bar
          takeScreenshot={(p) => this.takeScreenshot(p)}
          key="screenshot-control"
        />
      );
    }
  }

  sidebar(){
    return <ScreenshotsPanel key="layers" />
  }

}

export default Screenshots;
