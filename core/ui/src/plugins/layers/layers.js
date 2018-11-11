import React from 'react';

import LayersPanel from './panel';
import { updateLayers, setActiveLayer, getLayers } from '../layers/with-layers';

class Layers {

  constructor(client){
    this.client = client;
    this.client.getLayers = getLayers;
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
