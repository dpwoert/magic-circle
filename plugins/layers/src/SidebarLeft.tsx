import React, { useEffect, useMemo, Fragment } from 'react';
import styled from 'styled-components';

import { useStore, usePermanentState } from '@magic-circle/state';
import { SPACING, COLORS, TYPO, Icon } from '@magic-circle/styles';

import type Layers from './index';

import { iconMap, LayerIcon as LayerIconList } from './icon';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`;

const Inner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

type LayerRowProps = {
  index: number;
  depth: number;
  selected?: boolean;
  hasChildLayers?: boolean;
};

const getRowColor = (index: number, selected: boolean) => {
  if (selected) return String(COLORS.shades.s500.mix(COLORS.accent, 0.75));
  if (index % 2 === 1) return COLORS.shades.s500.css;
  return 'none';
};

const LayerRow = styled.div<LayerRowProps>`
  ${TYPO.medium}
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${(props) => SPACING(props.depth * 1) + SPACING(1)}px;
  padding-right: ${(props) =>
    props.hasChildLayers ? SPACING(1) : SPACING(2)}px;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  height: ${SPACING(4)}px;
  width: 100%;
  color: ${COLORS.white.css};
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: ${(props) => getRowColor(props.index, !!props.selected)};
  font-weight: ${(props) => (props.selected ? 700 : 400)};

  &:hover {
    background: ${(props) =>
      props.selected
        ? String(COLORS.shades.s500.mix(COLORS.accent, 0.75))
        : String(COLORS.shades.s500.mix(COLORS.accent, 0.1))};
  }

  span {
    display: flex;
    align-items: center;

    svg {
      color: ${(props) =>
        props.selected ? COLORS.white.css : COLORS.shades.s400.css};
    }
  }
`;

const LayerIcon = styled(Icon)`
  margin: ${SPACING(0.5)}px;
`;

const LayerEmpty = styled.div`
  ${TYPO.regular}
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: ${SPACING(1)}px;
  padding-right: ${SPACING(2)}px;
  gap: ${SPACING(1)}px;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  height: ${SPACING(5)}px;
  width: 100%;
  color: ${COLORS.shades.s300.css};
  background: ${COLORS.shades.s600.css};
  font-weight: 400;
`;

type ChevronProps = {
  collapsed: boolean;
};

const Chevron = styled(Icon)<ChevronProps>`
  transform: rotate(${(props) => (props.collapsed ? 0 : -180)}deg);
  transition: transform 0.2s ease;
`;

type LayerProps = {
  layers: Layers;
  layer: Layers['layers']['value'][0];
  depth: number;
  indexList: string[];
};

const Layer = ({ layers, layer, depth, indexList }: LayerProps) => {
  const selected = useStore(layers.selected);
  const [expand, setExpand] = usePermanentState(
    `collapsed-${layer.path}`,
    !layer.collapse
  );
  const hasChildLayers =
    layer.children.filter((c) => 'children' in c && !c.folder).length > 0;

  return (
    <Fragment key={layer.path}>
      <LayerRow
        index={indexList.indexOf(layer.path)}
        key={layer.path}
        depth={depth}
        selected={selected === layer.path}
        onClick={() => {
          layers.selected.set(layer.path);
        }}
        hasChildLayers={hasChildLayers}
      >
        <span>
          {layer.icon && (
            <LayerIcon
              name={iconMap[layer.icon as LayerIconList] || 'Rows'}
              width={SPACING(1.5)}
              height={SPACING(1.5)}
            />
          )}
          {layer.name}
        </span>
        {hasChildLayers && (
          <Chevron
            name="ChevronDown"
            width={SPACING(2)}
            height={SPACING(2)}
            onClick={() => setExpand(!expand)}
            collapsed={!expand}
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
                indexList={indexList}
              />
            );
          }

          return null;
        })}
    </Fragment>
  );
};

type SidebarProps = {
  layers: Layers;
};

const Sidebar = ({ layers }: SidebarProps) => {
  const list = useStore(layers.flat);
  const tree = useStore(layers.layers);
  const selected = useStore(layers.selected);

  const indexList = useMemo(() => list.map((l) => l.path), [list]);

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
      <Inner>
        {tree.length === 0 && (
          <LayerEmpty>
            <Icon
              name="AnnotationWarning"
              width={SPACING(2)}
              height={SPACING(2)}
            />
            No layers detected
          </LayerEmpty>
        )}
        {tree.map(
          (layer) =>
            !layer.folder && (
              <Layer
                key={layer.path}
                layers={layers}
                layer={layer}
                depth={0}
                indexList={indexList}
              />
            )
        )}
      </Inner>
    </Container>
  );
};

export default Sidebar;
