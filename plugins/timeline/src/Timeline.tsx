import { useEffect, useMemo } from 'react';
import styled from 'styled-components';

import {
  COLORS,
  Forms,
  Icon,
  SPACING,
  TYPO,
  Placement,
  Tooltip,
} from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import type TimelinePlugin from './index';
import Canvas from './Canvas';
import Track from './Track';
import ValuePopup from './ValuePopup';
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
  justify-content: space-between;
  padding: 0 ${SPACING(1)}px;
  width: 100%;
  height: ${SPACING(3)}px;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.white.css};
  border-bottom: 1px solid ${COLORS.shades.s300.css};
`;

const SceneSelector = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: ${SPACING(0.5)}px;
  color: ${COLORS.shades.s100.css};

  svg:hover {
    color: ${COLORS.accent.css};
    cursor: pointer;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING(0.25)}px;

  span {
    margin-right: ${SPACING(0.25)}px;
  }
`;

type ZoomControlProps = {
  active: boolean;
};

const ZoomControl = styled.div<ZoomControlProps>`
  display: flex;
  opacity: ${(props) => (props.active ? 1 : 0.2)};
  cursor: ${(props) => (props.active ? 'pointer' : 'default')};
`;

const SidebarRows = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const AddTrack = styled.div`
  margin-top: ${SPACING(2)}px;
  padding-bottom: ${SPACING(2)}px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CanvasContainer = styled.div`
  position: relative;
  flex: 1;
`;

const ClockContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: ${SPACING(26)}px;
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
  color: ${COLORS.shades.s300.css};
  border: 1px solid ${COLORS.shades.s400.css};
  border-radius: 5px;
  padding-right: ${SPACING(0.5)}px;
  gap: ${SPACING(0.5)}px;

  span {
    font-feature-settings:
      'kern' 1,
      'tnum' 1;
  }

  span:nth-child(2) {
    color: ${COLORS.shades.s200.css};
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

type ButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = styled(Tooltip)<ButtonProps>`
  position: relative;
  width: 26px;
  height: 26px;
  border: 1px solid ${COLORS.black.opacity(0)};
  background: ${(props) =>
    props.active ? COLORS.shades.s500.css : COLORS.shades.s600.css};
  color: ${COLORS.white.css};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: -1px;
  top: -1px;
  z-index: ${(props) => (props.active ? 2 : 'inherit')};
  box-sizing: border-box;

  &:after {
    content: '';
    position: absolute;
    left: 0px;
    top: 0px;
    width: calc(100% - 0px);
    height: calc(100% - 0px);
    transition: border 0.2s ease;
    border: 1px solid
      ${(props) => (props.active ? COLORS.white.css : COLORS.shades.s300.css)};
  }

  &:hover:after {
    border: 1px solid ${COLORS.white.css};
    z-index: 1;
  }

  &:first-child:after {
    border-radius: 5px 0 0 5px;
  }

  &:last-child:after {
    border-radius: 0 5px 5px 0;
  }
`;

type TimelineProps = {
  timeline: TimelinePlugin;
};

const Timeline = ({ timeline }: TimelineProps) => {
  const show = useStore(timeline.show);
  const playing = useStore(timeline.playing);
  const playhead = useStore(timeline.playhead);
  const zoom = useStore(timeline.zoom);
  const scene = useStore(timeline.scene);
  const selected = useStore(timeline.selected);
  const setExternal = useStore(timeline.layers.setExternal);

  const secondClock = useMemo<number>(() => {
    if (!selected) return scene.duration;

    const value = scene.values[selected.path];
    return value && selected && value[selected.key]
      ? value[selected.key].time
      : scene.duration;
  }, [selected, scene]);

  useEffect(() => {
    const toggle = (evt: KeyboardEvent) => {
      if (show && evt.code === 'Space') {
        if (playing) {
          timeline.stop();
        } else {
          timeline.play();
        }
      }
    };

    window.addEventListener('keydown', toggle);

    return () => {
      window.removeEventListener('keydown', toggle);
    };
  }, [playing, show, timeline]);

  return (
    <Container show={show ? true : undefined}>
      <Header
        onClick={() => {
          timeline.show.set(!show);
        }}
      >
        <Icon name="Clock" width={SPACING(1)} height={SPACING(1)} /> Timeline
        <Arrow show={show ? true : undefined}>
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
              <SidebarHeader>
                <SceneSelector>
                  {scene.name}
                  <Icon
                    name="FloppyDisc"
                    width={SPACING(1.5)}
                    height={SPACING(1.5)}
                    onClick={() => timeline.saveCurrentScene()}
                  />
                </SceneSelector>
                <ZoomControls>
                  <span>{Math.round(zoom * 100)}%</span>
                  <ZoomControl active={zoom > 0}>
                    <Icon
                      name="ZoomOut"
                      width={SPACING(1.5)}
                      height={SPACING(1.5)}
                      onClick={() => {
                        timeline.zoom.set(Math.max(0, zoom - 0.1));
                      }}
                    />
                  </ZoomControl>
                  <ZoomControl active={zoom < 1}>
                    <Icon
                      name="ZoomIn"
                      width={SPACING(1.5)}
                      height={SPACING(1.5)}
                      onClick={() => {
                        timeline.zoom.set(Math.min(1, zoom + 0.1));
                      }}
                    />
                  </ZoomControl>
                </ZoomControls>
              </SidebarHeader>
              <SidebarRows id="timeline-rows">
                {Object.keys(scene.values).map((path) => (
                  <Track path={path} key={path} timeline={timeline} />
                ))}
                <AddTrack>
                  <Forms.Button
                    highlight={!!setExternal}
                    onClick={() => {
                      timeline.selectTrack();
                    }}
                  >
                    <Icon
                      name="Plus"
                      width={SPACING(1.5)}
                      height={SPACING(1.5)}
                    />
                    Add track
                  </Forms.Button>
                </AddTrack>
              </SidebarRows>
            </Sidebar>
            <CanvasContainer>
              <Canvas timeline={timeline} />
              <ClockContainer>
                <Clock>
                  <Buttons>
                    <Button
                      content=""
                      onClick={() => {
                        if (playing) {
                          timeline.stop();
                        } else {
                          timeline.play();
                        }
                      }}
                      disabled
                    >
                      <Icon
                        name={playing ? 'Pause' : 'Play'}
                        width={SPACING(1)}
                        height={SPACING(1)}
                      />
                    </Button>
                    <Button
                      active={scene.loop}
                      onClick={() => {
                        timeline.toggleLoop();
                      }}
                      content="Loop scene"
                      placement={Placement.BOTTOM}
                    >
                      <Icon
                        name="Refresh"
                        width={SPACING(1)}
                        height={SPACING(1)}
                      />
                    </Button>
                    <Button
                      active={scene.seamlessLoop}
                      onClick={() => {
                        timeline.toggleSeamlessLoop();
                      }}
                      content="Seamlessly loop start and end values"
                      placement={Placement.BOTTOM}
                    >
                      <Icon
                        name="Spinner"
                        width={SPACING(1)}
                        height={SPACING(1)}
                      />
                    </Button>
                  </Buttons>
                  <span>{formatTime(playhead)}</span>
                  <span>{formatTime(secondClock)}</span>
                </Clock>
              </ClockContainer>
            </CanvasContainer>
          </>
        )}
      </Inside>
      <ValuePopup timeline={timeline} />
    </Container>
  );
};

export default Timeline;
