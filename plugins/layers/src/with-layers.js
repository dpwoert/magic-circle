import React, { Component } from 'react';

let layers = [];
let activeLayer = {};
const listeners = [];

export const getLayers = () => layers;

export const refresh = () => {
  listeners.forEach(l => l(layers, activeLayer));
}

export const updateLayers = newLayers => {
  layers = newLayers;
  refresh();
}

export const setActiveLayer = (layer, path) => {
  activeLayer = layer;
  refresh();
}

export const addListener = fn => {
  listeners.push(fn);
}

export const removeListener = fn => {
  const id = listeners.indexOf(fn);
  listeners.splice(id, 1);
}

const withLayers = WrappedComponent =>
  class LayerProvider extends Component {

    static navigation = WrappedComponent.navigation;

    constructor(props, context){
      super(props, context);
      this.state = { layers };
      this.updateLayers = this.updateLayers.bind(this);
    }

    componentDidMount() {
      addListener(this.updateLayers);
    }

    componentWillUnmount() {
      removeListener(this.updateLayers);
    }

    updateLayers(layers, activeLayer) {
      this.setState({ layers, activeLayer });
    }

    render() {
      const { layers, activeLayer } = this.state;
      return <WrappedComponent layers={layers} activeLayer={activeLayer} {...this.props} />;
    }
  };

export default withLayers;
