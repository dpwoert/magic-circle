import React from 'react';

import LayersPanel from './panel';

const createMapping = (mapping, layer) => {
  mapping.set(layer.path, layer);

  if (layer.children) {
    layer.children.forEach(l => createMapping(mapping, l));
  }
  if (layer.controls) {
    layer.controls.forEach(c => createMapping(mapping, c));
  }
};

class Layers {
  static name = 'layers';

  static initStore() {
    return {
      layers: [],
      activeLayer: null,
      mapping: new Map(),
    };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;
    this.client.getLayers = this.getLayers.bind(this);
    this.client.addListener('layers', (e, payload) => this.setLayers(payload));
  }

  setLayers(layers) {
    // create mapping
    const mapping = new Map();
    layers.forEach(l => createMapping(mapping, l));
    let hasDefaultActive = !!this.store.get('activeLayer');

    // find default active layer if needed
    mapping.forEach(layer => {
      if (layer.children) {
        const hasChildControls = layer.children.reduce(
          (a, b) => ((b.controls || []).length > 0 && b.isFolder) || a,
          false
        );
        const hasControls =
          (layer.controls.length > 0 || !!hasChildControls) && !layer.disabled;

        if (hasControls && !hasDefaultActive) {
          hasDefaultActive = true;
          this.store.set('activeLayer', layer.path);
        }
      }
    });

    // Save new state
    this.store.set('layers', layers);
    this.store.set('mapping', mapping);
  }

  getLayers() {
    return this.store.get('layers');
  }

  sidebar() {
    const Panel = this.store.withStore(LayersPanel);
    return <Panel key="layers" />;
  }
}

export default Layers;
