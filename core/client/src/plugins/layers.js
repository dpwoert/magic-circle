import { Layer } from '../layer';

class LayersPlugin {
  constructor(client) {
    this.client = client;
    this.layers = [];
    this.mapping = new Map();

    // Setup client
    this.client.add = this.addLayer.bind(this);
    this.client.layer = this.createLayer.bind(this);
    this.client.regenerate = this.regenerate.bind(this);
    this.client.setStateAsDefault = this.setStateAsDefault.bind(this);
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

  addLayer(layer) {
    this.layers.push(layer);
    this.regenerate();
    return this;
  }

  createLayer(name) {
    const layer = new Layer(name);
    this.layers.push(layer);
    this.regenerate();
    return layer;
  }

  setStateAsDefault() {
    this.forEach(c => {
      if (c.setStateAsDefault) {
        c.setStateAsDefault();
      }
    });
    this.regenerate();
  }

  forEach(fn) {
    const read = list => {
      list.forEach(layer => {
        fn(layer);
        if (layer.controls) {
          layer.controls.forEach(fn);
        }
        if (layer.children) {
          read(layer.children);
        }
      });
    };
    read(this.layers);
  }

  regenerate(now) {
    if (this.regenerateFrame && !now) {
      window.clearTimeout(this.regenerateFrame);
    }

    const regenerate = () => {
      this.mapping.clear();
      const data = this.layers.map(l => l.toJSON(this.mapping));
      this.client.sendMessage('layers', data);
    };

    if (now) {
      regenerate();
    } else {
      this.regenerateFrame = window.setTimeout(() => regenerate());
    }
  }

  setValue(path, value) {
    const control = this.mapping.get(path);

    if (control) {
      control.setValue(value);
      // this.regenerate();
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
