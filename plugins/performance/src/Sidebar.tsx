import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { Metric } from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import type Performance from './index';
import Chart from './Chart';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type SidebarProps = {
  performance: Performance;
};

const displayMetric = (value: number, unit: string) => {
  if (!value) return 'N/A';
  return `${Math.round(value)}${unit}`;
};

const Sidebar = ({ performance }: SidebarProps) => {
  const loadTimes = useStore(performance.loadTimes);
  const fps = useStore(performance.fps);
  const renderTime = useStore(performance.renderTime);
  const memory = useStore(performance.memory);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const setSize = () => {
      const frame = document.querySelector('#frame');

      if (frame) {
        setWidth(frame.clientWidth);
        setHeight(frame.clientHeight);
      }
    };

    setSize();
    window.addEventListener('resize', setSize);

    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, []);

  const maxRenderTime = useMemo(() => {
    return Math.max(...[...renderTime, 20]);
  }, [renderTime]);

  return (
    <Container>
      <Metric.Container>
        Frames per second
        <Metric.Value>{displayMetric(fps[fps.length - 1], 'fps')}</Metric.Value>
      </Metric.Container>
      <Chart max={60} values={fps} />
      <Metric.Container>
        Render time
        <Metric.Value>
          {displayMetric(renderTime[renderTime.length - 1], 'ms')}
        </Metric.Value>
      </Metric.Container>
      <Chart max={maxRenderTime} values={renderTime} />
      <Metric.Container>
        Memory
        <Metric.Value>{displayMetric(memory, 'mb')}</Metric.Value>
      </Metric.Container>
      <Metric.Container>
        First paint
        <Metric.Value>
          {loadTimes.firstPaint
            ? displayMetric(loadTimes.firstPaint, 'ms')
            : '?'}
        </Metric.Value>
      </Metric.Container>
      <Metric.Container>
        First contentful paint
        <Metric.Value>
          {loadTimes.firstContentfulPaint
            ? displayMetric(loadTimes.firstContentfulPaint, 'ms')
            : '?'}
        </Metric.Value>
      </Metric.Container>
      <Metric.Container>
        Load time
        <Metric.Value>
          {loadTimes.loadingTime
            ? displayMetric(loadTimes.loadingTime || 0, 'ms')
            : '?'}
        </Metric.Value>
      </Metric.Container>
      <Metric.Container>
        Frame width
        <Metric.Value>{displayMetric(width, 'px')}</Metric.Value>
      </Metric.Container>
      <Metric.Container>
        Frame height
        <Metric.Value>{displayMetric(height, 'px')}</Metric.Value>
      </Metric.Container>
      <Metric.Container>
        Device pixel ratio
        <Metric.Value>{window.devicePixelRatio}</Metric.Value>
      </Metric.Container>
    </Container>
  );
};

export default Sidebar;
