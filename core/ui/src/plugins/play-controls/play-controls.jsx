import React from 'react';

import {updatePlayState} from './with-play-state.jsx';
import Bar from './bar.jsx';

class PlayControls {

  constructor(client){
    this.client = client;
    this.client.addListener('play', (evt, payload) => this.play());
    this.client.addListener('stop', (evt, payload) => this.stop());
  }

  play(){
    updatePlayState(true);
  }

  stop(){
    updatePlayState(false);
  }

  changeState(play){
    this.client.sendMessage('change-play-state', play);
  }

  header(position){
    if(position === 'left'){
      return (
        <Bar
          changeState={(p) => this.changeState(p)}
          refresh={() => this.client.refresh()}
          key="play-controls"
        />
      );
    }
  }

}

export default PlayControls;
