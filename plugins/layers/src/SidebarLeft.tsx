import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useStore } from '@magic-circle/state';
import { SPACING, COLORS, TYPO, Icon } from '@magic-circle/styles';

import type Layers from './index';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type LayerRowProps = {
  depth: number;
  selected?: boolean;
};

const LayerRow = styled.div<LayerRowProps>`
  ${TYPO.regular}
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${(props) => SPACING(props.depth * 2) + SPACING(1)}px;
  padding-right: ${SPACING(1)}px;
  align-items: center;
  height: ${SPACING(4)}px;
  color: ${COLORS.white.css};
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: ${(props) =>
    props.selected
      ? String(COLORS.shades.s500.mix(COLORS.accent, 0.75))
      : 'none'};
  font-weight: ${(props) => (props.selected ? 700 : 400)};

  &:nth-child(2n) {
    background: ${(props) =>
      props.selected
        ? String(COLORS.shades.s500.mix(COLORS.accent, 0.75))
        : COLORS.shades.s500.css};
  }

  &:hover {
    background: ${(props) =>
      props.selected
        ? String(COLORS.shades.s500.mix(COLORS.accent, 0.75))
        : String(COLORS.shades.s500.mix(COLORS.accent, 0.1))};
  }
`;

type LayerProps = {
  layers: Layers;
  layer: Layers['layers']['value'][0];
  depth: number;
};

const Layer = ({ layers, layer, depth }: LayerProps) => {
  const selected = useStore(layers.selected);
  const [expand, setExpand] = useState(true);

  return (
    <div key={layer.path}>
      <LayerRow
        key={layer.path}
        depth={depth}
        selected={selected === layer.path}
        onClick={() => {
          layers.selected.set(layer.path);
        }}
      >
        <span>{layer.name}</span>
        {layer.children.filter((c) => 'children' in c).length > 0 && (
          <Icon
            name="ChevronDown"
            width={SPACING(2)}
            height={SPACING(2)}
            onClick={() => setExpand(!expand)}
          />
        )}
      </LayerRow>
      {expand &&
        (layer.children || []).map((child) => {
          if ('children' in child && !child.folder) {
            return (
              <Layer
                key={child.path}
                layers={layers}
                layer={child}
                depth={depth + 1}
              />
            );
          }

          return null;
        })}
    </div>
  );
};

type SidebarProps = {
  layers: Layers;
};

const Sidebar = ({ layers }: SidebarProps) => {
  const list = useStore(layers.flat);
  const tree = useStore(layers.layers);
  const selected = useStore(layers.selected);

  useEffect(() => {
    // If nothing is selected, try to select the first option
    if (!selected || !list.find((l) => l.path === selected)) {
      // Ensure we have something to select...
      if (list.length > 0) {
        layers.selected.set(list[0].path);
      }
    }
  }, [selected, layers, list]);

  return (
    <Container>
      {tree.map(
        (layer) =>
          !layer.folder && (
            <Layer key={layer.path} layers={layers} layer={layer} depth={0} />
          )
      )}
    </Container>
  );
};

export default Sidebar;
