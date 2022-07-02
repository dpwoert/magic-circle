import styled from 'styled-components';

import { useStore } from '@magic-circle/state';
import { SPACING, COLORS, TYPO } from '@magic-circle/styles';

import type Layers from './index';
import { useEffect } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type LayerProps = {
  depth: number;
  selected?: boolean;
};

const Layer = styled.div<LayerProps>`
  ${TYPO.regular}
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left ${(props) => SPACING(props.depth * 2) + SPACING(1)}px;
  padding-right ${SPACING(1)}px;
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

type SidebarProps = {
  layers: Layers;
};

const Sidebar = ({ layers }: SidebarProps) => {
  const list = useStore(layers.flat);
  const selected = useStore(layers.selected);

  useEffect(() => {
    // If nothing is selected, try to select the first option
    if (!selected || !list.find((l) => l.path === selected)) {
      // Ensure we have something to select...
      if (list.length > 0) {
        layers.selected.set(list[0].path);
      }
    }
  }, [selected, layers]);

  return (
    <Container>
      {list.map((layer) => (
        <Layer
          key={layer.path}
          depth={layer.depth}
          selected={selected === layer.path}
          onClick={() => {
            layers.selected.set(layer.path);
          }}
        >
          <span>{layer.name}</span>
          {/* {layer.hasChildren && (
            <Icon name="ChevronDown" width={SPACING(2)} height={SPACING(2)} />
          )} */}
        </Layer>
      ))}
    </Container>
  );
};

export default Sidebar;
