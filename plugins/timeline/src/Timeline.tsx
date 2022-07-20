import { useState } from 'react';
import styled from 'styled-components';

import { COLORS, Icon, SPACING, TYPO } from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import type TimelinePlugin from './index';
import Canvas from './Canvas';
import { formatTime } from './utils';

type ContainerProps = {
  show: boolean;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  height: ${(props) => (props.show ? '40vh' : `${SPACING(2)}px`)};
  min-height: 0;
`;

const Header = styled.div`
  ${TYPO.small}
  position: relative;
  height: ${SPACING(2)}px;
  border-top: 1px solid ${COLORS.shades.s300.css};
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  padding-left: ${SPACING(1)}px;
  color: ${COLORS.shades.s100.css};
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: ${SPACING(0.5)}px;
`;

type ArrowProps = {
  show: boolean;
};

const Arrow = styled.div<ArrowProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.shades.s100.css};
`;

const Inside = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  min-height: 0;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: ${SPACING(22)}px;
  border-right: 1px solid ${COLORS.shades.s300.css};
`;

const SidebarHeader = styled.div`
  ${TYPO.small}
  display: flex;
  align-items: center;
  padding: 0 ${SPACING(1)}px;
  width: 100%;
  height: ${SPACING(3)}px;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.white.css};
  border-bottom: 1px solid ${COLORS.shades.s300.css};
`;

const SidebarRows = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: auto;
`;

const SidebarRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${SPACING(1)}px;
  width: 100%;
  height: ${SPACING(6)}px;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.white.css};
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  flex-shrink: 0;
`;

const CanvasContainer = styled.div`
  position: relative;
  flex: 1;
`;

const ClockContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: ${SPACING(18)}px;
  height: ${SPACING(3)}px;
  display: flex;
  padding-right: ${SPACING(0.5)}px;
  justify-content: flex-end;
  align-items: center;
  background: linear-gradient(
    90deg,
    ${COLORS.shades.s600.opacity(0)} 0%,
    ${COLORS.shades.s600.css} 25%
  );
`;

const Clock = styled.div`
  ${TYPO.regular}
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.shades.s700.css};
  color: ${COLORS.shades.s200.css};
  border: 1px solid ${COLORS.shades.s400.css};
  border-radius: 5px;
  padding-right: ${SPACING(0.5)}px;
  gap: ${SPACING(0.5)}px;

  span {
    font-feature-settings: 'kern' 1, 'tnum' 1;
  }

  span:nth-child(2) {
    color: ${COLORS.shades.s300.css};
  }
`;

const PlayButton = styled.div`
  width: 26px;
  height: 26px;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.white.css};
  border: 1px solid ${COLORS.shades.s300.css};
  border-radius: 5px;
  margin-left: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border 0.2s ease;

  &:hover {
    border: 1px solid ${COLORS.white.css};
  }
`;

type TimelineProps = {
  app: TimelinePlugin['client'];
  timeline: TimelinePlugin;
};

const Timeline = ({ app, timeline }: TimelineProps) => {
  const [show, setShow] = useState(false);

  const playing = useStore(timeline.playing);
  const playhead = useStore(timeline.playhead);

  return (
    <Container show={show}>
      <Header
        onClick={() => {
          setShow(!show);
        }}
      >
        <Icon name="Clock" width={SPACING(1)} height={SPACING(1)} /> Timeline
        <Arrow show={show}>
          <Icon
            name={show ? 'ChevronDown' : 'ChevronUp'}
            width={SPACING(2)}
            height={SPACING(2)}
          />
        </Arrow>
      </Header>
      <Inside>
        {show && (
          <>
            <Sidebar>
              <SidebarHeader>Scene 1</SidebarHeader>
              <SidebarRows>
                <SidebarRow>Layer 1</SidebarRow>
                <SidebarRow>Layer 2</SidebarRow>
                <SidebarRow>Layer 3</SidebarRow>
                <SidebarRow>Layer 4</SidebarRow>
                <SidebarRow>Layer 5</SidebarRow>
                <SidebarRow>Layer 6</SidebarRow>
              </SidebarRows>
            </Sidebar>
            <CanvasContainer>
              <Canvas timeline={timeline} />
              <ClockContainer>
                <Clock>
                  <PlayButton
                    onClick={() => {
                      if (playing) {
                        timeline.ipc.send('timeline:stop');
                      } else {
                        timeline.ipc.send('timeline:play');
                      }
                    }}
                  >
                    <Icon
                      name={playing ? 'Pause' : 'Play'}
                      width={SPACING(1)}
                      height={SPACING(1)}
                    />
                  </PlayButton>
                  <span>{formatTime(playhead)}</span>
                  <span>{formatTime(playhead)}</span>
                </Clock>
              </ClockContainer>
            </CanvasContainer>
          </>
        )}
      </Inside>
    </Container>
  );
};

export default Timeline;
