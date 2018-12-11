import React, { Component } from 'react';
import styled from 'styled-components';

// import withLayers, { setActiveLayer } from './with-layers';

const layersIcon = 'assets/layers.svg';

const Panel = styled.ul`
  width: 100%;
  height: 100%;
`;

const getBackgroundColor = (selected, i) => {
  if(selected){
    return 'rgb(136,74,255,1)';
  } else {
    return i % 2 === 0 ? '#191919' : '#111111';
  }
}

const Item = styled.li`
  position: relative;
  font-size: 12px;
  line-height: 42px;
  padding-left: ${props => (props.depth + 1) * 12}px;
  color: white;
  list-style: none;
  background: ${props => getBackgroundColor(props.selected, props.i)};
  box-sizing: border-box;
  border-radius: ${props => props.selected ? 3 : 0}px;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`

class LayersPanel extends Component {

  static navigation = {
    name: 'layers',
    icon: layersIcon,
  };

  renderLayer(layers, layer, depth){
    layers.push(
      <Item
        key={layer.path}
        depth={depth}
        i={layers.length}
        selected={this.props.activeLayer === layer.path}
        onClick={() => this.props.set('activeLayer', layer.path)}
      >
        {layer.label}
      </Item>
    );

    if(layer.children){
      layer.children.forEach(l => this.renderLayer(layers, l, depth + 1));
    }
  }

  render(){
    const layers = [];
    this.props.layers.forEach(l => this.renderLayer(layers, l, 0))

    return(
      <Panel>
        {layers.map((layer) => layer)}
      </Panel>
    )
  }

}

export default LayersPanel;
