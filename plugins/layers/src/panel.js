import React, { Component } from 'react';
import styled from 'styled-components';
import Color from '@magic-circle/colors';

const Panel = styled.ul`
  width: 100%;
  height: 100%;
`;

const getBackgroundColor = (selected, i, accent) => {
  if (selected) {
    return new Color(accent).alpha(0.9).toCSS();
  }
  return i % 2 === 0 ? '#191919' : '#111111';
};

const Item = styled.li`
  position: relative;
  font-size: 12px;
  line-height: 42px;
  padding-left: ${props => (props.depth + 1) * 12}px;
  color: ${props => (props.hasControls ? 'white' : 'rgba(255,255,255, 0.5)')};
  list-style: none;
  background: ${props =>
    getBackgroundColor(props.selected, props.i, props.theme.accent)};
  box-sizing: border-box;
  border-radius: ${props => (props.selected ? 3 : 0)}px;
  font-weight: ${props => (props.selected ? 'bold' : 'normal')};
  cursor: default;
`;

class LayersPanel extends Component {
  static navigation = {
    name: 'layers',
    icon: 'Layers',
  };

  renderLayer(layers, layer, depth) {
    if (layer.isLayer) {
      const hasChildControls = layer.children.reduce(
        (a, b) => ((b.controls || []).length > 0 && b.isFolder) || a,
        false
      );
      const hasControls = layer.controls.length > 0 || !!hasChildControls;
      console.log(layer, hasControls, hasChildControls);

      layers.push(
        <Item
          key={layer.path}
          depth={depth}
          i={layers.length}
          selected={this.props.activeLayer === layer.path}
          onClick={() =>
            hasControls && this.props.set('activeLayer', layer.path)
          }
          hasControls={hasControls}
        >
          {layer.label}
        </Item>
      );
    }

    if (layer.children) {
      layer.children.forEach(l => this.renderLayer(layers, l, depth + 1));
    }
  }

  render() {
    const layers = [];
    this.props.layers.forEach(l => this.renderLayer(layers, l, 0));
    return <Panel>{layers.map(layer => layer)}</Panel>;
  }
}

export default LayersPanel;
