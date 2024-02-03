/*  eslint-disable consistent-return */

import styled from 'styled-components';
import { useEffect, useState } from 'react';

import {
  Warning,
  Forms,
  Control,
  SPACING,
  Metric,
  Icon,
} from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import type Recordings from './index';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING(1)}px;
`;

const BooleanInside = styled(Control.Inside)`
  justify-content: flex-end;
`;

type SidebarProps = {
  recordings: Recordings;
};

const Sidebar = ({ recordings }: SidebarProps) => {
  const current = useStore(recordings.current);
  const [allowSync, setAllowSync] = useState(false);

  useEffect(() => {
    const timeline = recordings.app.getPlugin('timeline') as any;

    if (timeline) {
      // set sync to true
      recordings.current.set({
        ...recordings.current.value,
        sync: true,
      });
      setAllowSync(true);

      const update = () => {
        const duration = Number(
          (timeline.scene.value.duration / 1000).toFixed(2)
        );

        recordings.current.set({
          ...recordings.current.value,
          duration,
        });
      };

      timeline.scene.onChange(update);
      update();

      return () => {
        timeline.scene.removeListener(update);
      };
    }
  }, [recordings]);

  if ('showOpenFilePicker' in window === false) {
    return (
      <Warning text="This functionality is currently not support in Firefox" />
    );
  }

  return (
    <Container>
      {!current.isRecording ? (
        <>
          <Control.Container hasChanges={false}>
            <Control.Label>Width</Control.Label>
            <Control.Inside>
              <Forms.Field
                value={current.width}
                type="number"
                onChange={(evt) => {
                  recordings.current.set({
                    ...recordings.current.value,
                    width: +evt.target.value,
                  });
                }}
              />
            </Control.Inside>
          </Control.Container>

          <Control.Container hasChanges={false}>
            <Control.Label>Height</Control.Label>
            <Control.Inside>
              <Forms.Field
                value={current.height}
                type="number"
                onChange={(evt) => {
                  recordings.current.set({
                    ...recordings.current.value,
                    height: +evt.target.value,
                  });
                }}
              />
            </Control.Inside>
          </Control.Container>

          <Control.Container hasChanges={false}>
            <Control.Label>FPS</Control.Label>
            <Control.Inside>
              <Forms.Select
                value={current.fps}
                onChange={(evt) => {
                  recordings.current.set({
                    ...recordings.current.value,
                    fps: +evt.target.value,
                  });
                }}
              >
                {recordings.app
                  .getSetting<number[]>('recordings.fps', [12, 24, 25, 30, 60])
                  .map((n) => (
                    <option key={n}>{n}</option>
                  ))}
              </Forms.Select>
            </Control.Inside>
          </Control.Container>

          <Control.Container hasChanges={false}>
            <Control.Label>Duration (s)</Control.Label>
            <Control.Inside>
              <Forms.Field
                value={current.duration}
                type="number"
                onChange={(evt) => {
                  recordings.current.set({
                    ...recordings.current.value,
                    duration: +evt.target.value,
                  });
                }}
              />
            </Control.Inside>
          </Control.Container>

          {allowSync && (
            <Control.Container hasChanges={false}>
              <Control.Label>Scene sync</Control.Label>
              <BooleanInside>
                <Forms.Checkbox
                  value={current.sync}
                  onChange={(val) => {
                    recordings.current.setFn((curr) => ({
                      ...curr,
                      sync: val,
                    }));
                  }}
                />
              </BooleanInside>
            </Control.Container>
          )}

          <ButtonArea>
            <Forms.Button highlight onClick={() => recordings.start()}>
              <Icon
                name="VideoCamera"
                width={SPACING(1.5)}
                height={SPACING(1.5)}
              />
              Start recording
            </Forms.Button>
          </ButtonArea>
        </>
      ) : (
        <>
          <Metric.Container>
            Width
            <Metric.Value>{current.width}</Metric.Value>
          </Metric.Container>
          <Metric.Container>
            Height
            <Metric.Value>{current.height}</Metric.Value>
          </Metric.Container>
          <Metric.Container>
            Duration
            <Metric.Value>{current.duration}</Metric.Value>
          </Metric.Container>
          <Metric.Container>
            FPS
            <Metric.Value>{current.fps}</Metric.Value>
          </Metric.Container>
          <Metric.Container>
            Total frames
            <Metric.Value>{current.fps * current.duration}</Metric.Value>
          </Metric.Container>
          <Metric.Container>
            Completed
            <Metric.Value>
              {Math.round(
                (current.frame / (current.fps * current.duration)) * 100
              )}
              %
            </Metric.Value>
          </Metric.Container>
        </>
      )}
    </Container>
  );
};

export default Sidebar;
