import { useMemo } from 'react';
import styled from 'styled-components';

import { COLORS, Icon, SPACING, TYPO } from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import Timeline from './index';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${SPACING(1)}px;
  width: 100%;
  height: ${SPACING(6)}px;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.white.css};
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  flex-shrink: 0;
`;

const Labels = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING(0.5)}px;

  span:nth-child(1) {
    ${TYPO.regular}
    color: ${COLORS.white.css};
  }

  span:nth-child(2) {
    ${TYPO.small}
    color: ${COLORS.shades.s200.css};
  }
`;

const Options = styled.div`
  display: flex;
  gap: ${SPACING(0.5)}px;
  align-items: center;
  color: ${COLORS.shades.s100.css};
`;

type OptionProps = {
  disabled?: boolean;
};

const Option = styled.div<OptionProps>`
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`;

type TrackProps = {
  timeline: Timeline;
  path: string;
};

const Track = ({ timeline, path }: TrackProps) => {
  const control = useStore(timeline.layers.lookup.get(path));
  const scene = useStore(timeline.scene);
  const playhead = useStore(timeline.playhead);
  const selected = useStore(timeline.selected);

  const isEased = useMemo<boolean>(() => {
    const value = scene.values[path];
    return (
      value &&
      selected &&
      value[selected.key] &&
      !!value[selected.key].controlPoints
    );
  }, [selected, scene, path]);

  if ('label' in control) {
    return (
      <Container key={path}>
        <Labels>
          <span>{control.label}</span>
          <span>{control.path}</span>
        </Labels>
        <Options>
          {/* <Icon name="Eye" width={SPACING(1.5)} height={SPACING(1.5)} /> */}
          <Option onClick={() => timeline.addKeyframe(path, playhead)}>
            <Icon
              name="PlusCircle"
              width={SPACING(1.5)}
              height={SPACING(1.5)}
            />
          </Option>
          <Option
            disabled={!selected || selected.path !== path}
            onClick={() => timeline.removeKeyframe(path, selected.key)}
          >
            <Icon name="Trash" width={SPACING(1.5)} height={SPACING(1.5)} />
          </Option>
          <Option
            disabled={!selected || selected.path !== path}
            onClick={() => {
              timeline.toggleEaseForKeyframe(path, selected.key);
            }}
          >
            <Icon
              name={isEased ? 'Linear' : 'Ease'}
              width={SPACING(1.5)}
              height={SPACING(1.5)}
            />
          </Option>
        </Options>
      </Container>
    );
  }

  return null;
};

export default Track;
