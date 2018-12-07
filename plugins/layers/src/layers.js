import React from 'react';

import LayersPanel from './panel';

class Layers {

  static name = 'layers';

  static initStore(){
    return {
      layers: [],
      activeLayer: {},
    };
  }

  constructor(client, store){
    this.client = client;
    this.store = store;
    this.client.getLayers = this.getLayers.bind(this);
    this.client.addListener('layers', (evt, payload) => this.setLayers(payload));
  }

  setLayers(layers){
    this.store.set('layers', layers);
  }

  setActiveLayer(layer){
    this.store.set('activeLayer', layer);
  }

  getLayers(){
    this.store.get('layers')
  }

  sidebar(){
    const Panel = this.store.withStore(LayersPanel);
    return <Panel key="layers" />;
  }

}

export default Layers;
