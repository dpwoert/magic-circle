import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { SPACING, COLORS, TYPO } from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import type Performance from './index';
import Chart from './Chart';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Metric = styled.div`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${SPACING(4)}px;
  padding: 0 ${SPACING(1)}px;
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  color: ${COLORS.white.css};
  background: ${COLORS.shades.s600.css};
`;

const MetricValue = styled.div`
  ${TYPO.metric}
`;

type SidebarProps = {
  performance: Performance;
};

const displayMetric = (value: number, unit: string) => {
  if (!value) return 'N/A';
  return `${Math.round(value)}${unit}`;
};

export const Sidebar = ({ performance }: SidebarProps) => {
  const loadTimes = useStore(performance.loadTimes);
  const fps = useStore(performance.fps);
  const renderTime = useStore(performance.renderTime);
  const memory = useStore(performance.memory);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const setSize = () => {
      const frame = document.querySelector('#frame');
      setWidth(frame.clientWidth);
      setHeight(frame.clientHeight);
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
      <Metric>
        Frames per second
        <MetricValue>{displayMetric(fps[fps.length - 1], 'fps')}</MetricValue>
      </Metric>
      <Chart max={60} values={fps} />
      <Metric>
        Render time
        <MetricValue>
          {displayMetric(renderTime[renderTime.length - 1], 'ms')}
        </MetricValue>
      </Metric>
      <Chart max={maxRenderTime} values={renderTime} />
      <Metric>
        Memory
        <MetricValue>{displayMetric(memory, 'mb')}</MetricValue>
      </Metric>
      <Metric>
        First paint
        <MetricValue>{displayMetric(loadTimes.firstPaint, 'ms')}</MetricValue>
      </Metric>
      <Metric>
        First contentful paint
        <MetricValue>
          {displayMetric(loadTimes.firstContentfulPaint, 'ms')}
        </MetricValue>
      </Metric>
      <Metric>
        Load time
        <MetricValue>{displayMetric(loadTimes.loadingTime, 'ms')}</MetricValue>
      </Metric>
      <Metric>
        Frame width
        <MetricValue>{displayMetric(width, 'px')}</MetricValue>
      </Metric>
      <Metric>
        Frame height
        <MetricValue>{displayMetric(height, 'px')}</MetricValue>
      </Metric>
      <Metric>
        Device pixel ratio
        <MetricValue>{window.devicePixelRatio}</MetricValue>
      </Metric>
    </Container>
  );
};

export default Sidebar;
