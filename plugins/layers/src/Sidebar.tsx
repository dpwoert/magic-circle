import { useMemo } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

import { SPACING, COLORS, Icon } from '@magic-circle/styles';
import type { LayerExport } from '@magic-circle/schema';

import type Layers from './index';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type LayerProps = {
  depth: number;
};

const Layer = styled.div<LayerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left ${(props) => SPACING(props.depth * 2) + SPACING(1)}px;
  padding-right ${SPACING(1)}px;
  align-items: center;
  height: ${SPACING(4)}px;
  color: ${COLORS.white.css};
  cursor: pointer;

  &:nth-child(2n) {
    background: ${COLORS.shades.s500.css};
  }
`;

type SidebarProps = {
  layers: Layers;
};

type FlatListItem = LayerExport & {
  depth: number;
  hasChildren: boolean;
};

const Sidebar = ({ layers }: SidebarProps) => {
  const main = useRecoilValue(layers.recoil);

  const flat = useMemo<FlatListItem[]>(() => {
    const flattened: FlatListItem[] = [];

    const recursive = (layers: LayerExport[] = [], depth = 0) => {
      layers.forEach((child) => {
        flattened.push({
          ...child,
          depth,
          hasChildren: child.children && child.children.length > 0,
        });

        if (child.children) {
          recursive(child.children, depth + 1);
        }
      });
    };

    recursive(main.layers);
    return flattened;
  }, [main]);

  return (
    <Container>
      {flat.map((layer) => (
        <Layer depth={layer.depth}>
          <span>{layer.name}</span>
          {layer.hasChildren && (
            <Icon name="ChevronDown" width={SPACING(2)} height={SPACING(2)} />
          )}
        </Layer>
      ))}
    </Container>
  );
};

export default Sidebar;
