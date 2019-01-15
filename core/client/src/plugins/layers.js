class LayersPlugin {
  constructor(client) {
    this.client = client;
    this.layers = [];
    this.mapping = new Map();

    // Setup client
    this.client.addLayer = this.addLayer.bind(this);
    this.client.addLayers = this.addLayers.bind(this);
    this.client.regenerate = this.regenerate.bind(this);
  }

  connect() {
    // Event listeners
    this.client.addListener('control-set-value', (evt, payload) => {
      this.setValue(payload.path, payload.value);
    });
    this.client.addListener('control-reset', (evt, payload) => {
      this.reset(payload.path);
    });
    this.client.addListener('resync', () => {
      this.regenerate();
    });

    this.regenerate();
  }

  addLayers(...layers) {
    layers.forEach(l => this.addLayer(l, false));
    this.regenerate();
  }

  addLayer(layer, regenerate = true) {
    this.layers.push(layer);

    // Regenerate tree if needed
    if (regenerate) {
      this.regenerate();
    }
  }

  regenerate() {
    this.mapping.clear();
    const data = this.layers.map(l => l.toJSON(this.mapping));
    this.client.sendMessage('layers', data);
  }

  setValue(path, value) {
    const control = this.mapping.get(path);

    if (control) {
      control.setValue(value);
    } else {
      console.error('could not update control', path, value);
    }
  }

  reset(path) {
    const control = this.mapping.get(path);

    if (control) {
      control.reset();
    } else {
      console.error('could not update control', path);
    }
  }
}

export default LayersPlugin;
