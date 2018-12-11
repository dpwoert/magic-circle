import React from 'react';

import LayersPanel from './panel';

const createMapping = (mapping, layer) => {
  mapping.set(layer.path, layer);
  layer.children.forEach(l => createMapping(mapping, l));
};

class Layers {

  static name = 'layers';

  static initStore(){
    return {
      layers: [],
      activeLayer: null,
      mapping: new Map(),
    };
  }

  constructor(client, store){
    this.client = client;
    this.store = store;
    this.client.getLayers = this.getLayers.bind(this);
    this.client.addListener('layers', (evt, payload) => this.setLayers(payload));
  }

  setLayers(layers, update){

    // create mapping
    const mapping = new Map();
    layers.forEach(l => createMapping(mapping, l));

    // Save new state
    this.store.set('layers', layers);
    this.store.set('mapping', mapping);
  }

  getLayers(){
    return this.store.get('layers');
  }

  sidebar(){
    const Panel = this.store.withStore(LayersPanel);
    return <Panel key="layers" />;
  }

}

export default Layers;
