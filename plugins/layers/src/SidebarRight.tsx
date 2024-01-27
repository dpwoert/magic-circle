import styled from 'styled-components';
import shallowEqual from 'shallowequal';

import { App, LayerExport } from '@magic-circle/schema';
import {
  useStore,
  usePermanentState,
  useStoreFamily,
} from '@magic-circle/state';
import { SPACING, COLORS, TYPO, Icon, Expand } from '@magic-circle/styles';

import { iconMap, LayerIcon as LayerIconList } from './icon';

import type Layers from './index';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${COLORS.white.css};
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const GroupHeader = styled.div`
  ${TYPO.title}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${SPACING(1)}px;
  height: ${SPACING(5)}px;
  background: ${COLORS.shades.s600.css};
  border-bottom: 1px solid ${String(COLORS.shades.s400.opacity(0.5))};

  span {
    display: flex;
    align-items: center;
  }
`;

const GroupIcon = styled(Icon)`
  margin-right: ${SPACING(1)}px;
  color: ${COLORS.shades.s400.css};
`;

type ChevronProps = {
  collapsed: boolean;
};

const Chevron = styled(Icon)<ChevronProps>`
  transform: rotate(${(props) => (props.collapsed ? 0 : -180)}deg);
  transition: transform 0.2s ease;
  cursor: pointer;
`;

type ControlProps = {
  layers: Layers;
  controlPath: string;
};

const Control = ({ layers, controlPath }: ControlProps) => {
  const control = useStoreFamily(layers.lookup, controlPath);
  const setExternal = useStore(layers.setExternal);

  if (control && 'type' in control) {
    const type = layers.getControl(control.type);
    const Element = type?.render;

    if (!Element) {
      throw new Error(
        `Could not find control type named ${control.type}, make sure to include it in the config file`
      );
    }

    let select;

    if (setExternal && type.supports && layers.setExternal.value) {
      select = type.supports(layers.setExternal.value.filter, control.options)
        ? {
            label: layers.setExternal.value.label,
            icon: layers.setExternal.value.icon,
            onSelect: () => {
              if (layers.setExternal.value) {
                layers.setExternal.value.onSelect(control.path);
              }
            },
          }
        : undefined;
    }

    return (
      // @ts-ignore
      <Element
        key={control.path}
        value={control.value}
        label={control.label}
        options={control.options}
        select={select}
        hasChanges={
          !shallowEqual(control.value, control.initialValue) &&
          !control.watching
        }
        set={(newValue: any) => layers.setControl(control.path, newValue)}
        reset={() => layers.resetControl(control.path)}
      />
    );
  }

  throw new Error('Control data is corrupted');
};

type GroupProps = {
  layers: Layers;
  group: LayerExport;
};

const Group = ({ layers, group }: GroupProps) => {
  const [expand, setExpand] = usePermanentState(
    `collapsed-${group.path}`,
    !group.collapse
  );
  const hasChildren = group.children.length > 0;
  return (
    <GroupContainer>
      <GroupHeader>
        <span>
          <GroupIcon
            name={iconMap[group.icon as LayerIconList] || 'Folder'}
            width={SPACING(1.5)}
            height={SPACING(1.5)}
          />
          {group.name}
        </span>
        {hasChildren && (
          <Chevron
            name="ChevronDown"
            width={SPACING(2)}
            height={SPACING(2)}
            onClick={() => setExpand(!expand)}
            collapsed={!expand}
          />
        )}
      </GroupHeader>
      <Expand expand={expand}>
        {group.children.map((c) => {
          if ('value' in c) {
            return (
              <Control key={c.path} layers={layers} controlPath={c.path} />
            );
          }

          return null;
        })}
      </Expand>
    </GroupContainer>
  );
};

type SidebarProps = {
  app: App;
  layers: Layers;
};

const SidebarRight = ({ layers }: SidebarProps) => {
  const selected = useStore(layers.selected);
  const layer = useStoreFamily(layers.lookup, selected || '');

  if (layer && 'children' in layer) {
    return (
      <Container>
        {layer.children.map((item) => {
          if ('label' in item) {
            return (
              <Control
                key={item.path}
                layers={layers}
                controlPath={item.path}
              />
            );
          }

          if (item.folder) {
            return <Group key={item.path} layers={layers} group={item} />;
          }

          return null;
        })}
      </Container>
    );
  }

  return <Container />;
};

export default SidebarRight;
