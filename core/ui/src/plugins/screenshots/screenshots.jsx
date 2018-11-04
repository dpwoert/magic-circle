import React from 'react';
import { ipcRenderer } from 'electron';

import Bar from './bar.jsx';
import ScreenshotsPanel from './panel.jsx';

class Screenshots {

  constructor(client){
    this.client = client;
  }

  takeScreenshot(){
    ipcRenderer.send('screenshot');
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
    return <ScreenshotsPanel key="screenshots" />
  }

}

export default Screenshots;
