import styled from 'styled-components';
import shallowEqual from 'shallowequal';

import { App, LayerExport } from '@magic-circle/schema';
import { useStore } from '@magic-circle/state';
import { SPACING, COLORS, TYPO } from '@magic-circle/styles';

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
  padding: 0 ${SPACING(1)}px;
  height: ${SPACING(5)}px;
  background: ${COLORS.shades.s600.css};
  border-bottom: 1px solid ${String(COLORS.shades.s400.opacity(0.5))};
`;

type ControlProps = {
  layers: Layers;
  controlPath: string;
};

const Control = ({ layers, controlPath }: ControlProps) => {
  const control = useStore(layers.lookup.get(controlPath));
  const setExternal = useStore(layers.setExternal);

  if (control && 'type' in control) {
    const type = layers.getControl(control.type);
    const Element = type?.render;

    if (!Element) {
      throw new Error(
        'Could not find control type, make sure to include it in the config file'
      );
    }

    let select;

    if (setExternal && type.supports) {
      select = type.supports(
        layers.setExternal.value.filter,
        control.options
      ) && {
        label: layers.setExternal.value.label,
        icon: layers.setExternal.value.icon,
        onSelect: () => layers.setExternal.value.onSelect(control.path),
      };
    }

    return (
      <Element
        key={control.path}
        value={control.value}
        label={control.label}
        options={control.options}
        select={select}
        hasChanges={!shallowEqual(control.value, control.initialValue)}
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
  return (
    <GroupContainer>
      <GroupHeader>{group.name}</GroupHeader>
      {group.children.map((c) => {
        if ('value' in c) {
          return <Control layers={layers} controlPath={c.path} />;
        }

        return null;
      })}
    </GroupContainer>
  );
};

type SidebarProps = {
  app: App;
  layers: Layers;
};

const SidebarRight = ({ layers }: SidebarProps) => {
  const selected = useStore(layers.selected);
  const layer = useStore(layers.lookup.get(selected));

  if (layer && 'children' in layer) {
    return (
      <Container>
        {layer.children.map((item) => {
          if ('label' in item) {
            return <Control layers={layers} controlPath={item.path} />;
          }

          if (item.folder) {
            return <Group layers={layers} group={item} />;
          }

          return null;
        })}
      </Container>
    );
  }

  return <Container />;
};

export default SidebarRight;
