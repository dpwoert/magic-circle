import styled from 'styled-components';

import { COLORS, SPACING, TYPO } from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import type Timeline from './index';
import type { selection } from './index';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 11;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.black.opacity(0.5)};
  z-index: 10;
`;

const Popup = styled.div`
  display: flex;
  flex-direction: column;
  width: ${SPACING(23)}px;
  pointer-events: all;
  background: ${COLORS.shades.s500.css};
  color: ${COLORS.white.css};
`;

const Header = styled.div`
  ${TYPO.title}
  display: flex;
  align-items: center;
  padding: 0 ${SPACING(1)}px;
  height: ${SPACING(5)}px;
  border-bottom: 1px solid ${String(COLORS.shades.s400.opacity(0.5))};
`;

type ValuePopupControlProps = {
  timeline: Timeline;
  selection: selection;
};

const ValuePopupControl = ({ timeline, selection }: ValuePopupControlProps) => {
  const control = useStore(timeline.layers.lookup.get(selection.path));

  if ('value' in control) {
    const type = timeline.layers.getControl(control.type);

    const Element = type?.render;
    const { value } = timeline.getKeyframeByKey(selection.path, selection.key);

    if (Element && value !== undefined) {
      return (
        <>
          <Overlay
            onClick={() => {
              timeline.valuePopup.set(false);
            }}
          />
          <Container>
            <Popup>
              <Header>Edit value for keyframe</Header>
              <Element
                key={control.path}
                value={value}
                label={control.label}
                options={control.options}
                hasChanges={false}
                set={(newValue: any) => {
                  timeline.changeKeyframe(
                    selection.path,
                    selection.key,
                    newValue
                  );
                }}
                reset={() => {
                  console.warn('This function is not supported');
                }}
              />
            </Popup>
          </Container>
        </>
      );
    }
  }

  return null;
};
type ValuePopupProps = {
  timeline: Timeline;
};

const ValuePopup = ({ timeline }: ValuePopupProps) => {
  const show = useStore(timeline.valuePopup);
  const selection = useStore(timeline.selected);

  if (!show || !selection) return null;

  return (
    <Container>
      <Overlay
        onClick={() => {
          timeline.valuePopup.set(false);
        }}
      />
      <Popup>
        <ValuePopupControl timeline={timeline} selection={selection} />
      </Popup>
    </Container>
  );
};

export default ValuePopup;
