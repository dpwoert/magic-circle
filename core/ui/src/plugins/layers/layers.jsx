import React from 'react';

import LayersPanel from './panel.jsx';
import { updateLayers, setActiveLayer } from '../layers/with-layers.jsx';

class Layers {

  constructor(client){
    this.client = client;
    this.client.addListener('layers', (evt, payload) => this.setLayers(payload));
  }

  setLayers(layers){
    updateLayers(layers);
  }

  setActiveLayer(layer){
    setActiveLayer(layer);
  }

  sidebar(){
    return <LayersPanel key="layers" />
  }

}

export default Layers;
