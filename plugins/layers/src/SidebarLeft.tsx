import React, { useEffect, useMemo, Fragment } from 'react';
import styled from 'styled-components';

import { useStore, usePermanentState } from '@magic-circle/state';
import { SPACING, COLORS, TYPO, Icon } from '@magic-circle/styles';

import type Layers from './index';

import { iconMap, LayerIcon as LayerIconList } from './icon';

const MAX_DEPTH = 3;

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
  depthZoomBase?: boolean;
};

const getRowColor = (
  index: number,
  selected: boolean,
  depthZoomBase: boolean
) => {
  if (selected) return String(COLORS.shades.s500.mix(COLORS.accent, 0.75));
  if (depthZoomBase) return String(COLORS.shades.s700.css);
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
  background: ${(props) =>
    getRowColor(props.index, !!props.selected, !!props.depthZoomBase)};
  font-weight: ${(props) => (props.selected ? 700 : 400)};
  border-bottom: ${(props) =>
    props.depthZoomBase ? `1px solid ${COLORS.shades.s100.css}` : 'none'};

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
  currentDepth: number;
  indexList: string[];
  depthZoomBase?: boolean;
};

const Layer = ({
  layers,
  layer,
  depth,
  currentDepth,
  indexList,
  depthZoomBase = false,
}: LayerProps) => {
  const selected = useStore(layers.selected);
  const [expand, setExpand] = usePermanentState(
    `collapsed-${layer.path}`,
    !layer.collapse
  );
  const hasChildLayers =
    layer.children.filter((c) => 'children' in c && !c.folder).length > 0;
  const reachedMaxDepth = depth >= currentDepth + MAX_DEPTH;

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
        depthZoomBase={depthZoomBase}
      >
        <span>
          <LayerIcon
            name={iconMap[layer.icon as LayerIconList] || 'Rows'}
            width={SPACING(1.5)}
            height={SPACING(1.5)}
          />
          {layer.name}
        </span>
        {hasChildLayers && !reachedMaxDepth && !depthZoomBase && (
          <Chevron
            name="ChevronDown"
            width={SPACING(2)}
            height={SPACING(2)}
            onClick={() => setExpand(!expand)}
            collapsed={!expand}
          />
        )}
        {hasChildLayers && !reachedMaxDepth && depthZoomBase && (
          <Icon
            name="Close"
            width={SPACING(1.5)}
            height={SPACING(1.5)}
            onClick={() => layers.depthStart.set(null)}
          />
        )}
        {hasChildLayers && reachedMaxDepth && (
          <Chevron
            name="ChevronRight"
            width={SPACING(2)}
            height={SPACING(2)}
            onClick={() => {
              layers.depthStart.set({
                layer,
                depth,
              });
            }}
            collapsed={true}
          />
        )}
      </LayerRow>
      {expand &&
        !reachedMaxDepth &&
        (layer.children || []).map((child) => {
          if ('children' in child && !child.folder) {
            return (
              <Layer
                key={child.path}
                layers={layers}
                layer={child}
                depth={depth + 1}
                currentDepth={currentDepth}
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
  const depthStart = useStore(layers.depthStart);

  const indexList = useMemo(() => list.map((l) => l.path), [list]);

  const { startLayers, currentDepth } = useMemo(() => {
    if (!depthStart) return { startLayers: tree, currentDepth: 0 };

    return {
      startLayers: [depthStart.layer],
      currentDepth: depthStart.depth,
    };
  }, [tree, depthStart]);

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
        {startLayers.map(
          (layer) =>
            !layer.folder && (
              <Layer
                key={layer.path}
                layers={layers}
                layer={layer}
                depth={0}
                currentDepth={currentDepth}
                indexList={indexList}
                depthZoomBase={currentDepth !== 0}
              />
            )
        )}
      </Inner>
    </Container>
  );
};

export default Sidebar;
