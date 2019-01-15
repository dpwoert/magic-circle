import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

import PerformanceChart from './chart';

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Section = styled.div`
  margin-top: 24px;
  padding: 16px;
  margin-bottom: 48px;
`;

const Heading = styled.h2`
  font-size: 14px;
  font-weight: bold;
  color: white;
  margin-bottom: 12px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Value = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.accent};
`;

const Chart = styled.div`
  flex: 1;
`;

const getLast = arr => arr[arr.length - 1];

const displayMetric = value => (value >= 0 ? value : 'N/A');

class PerformancePanel extends Component {
  static navigation = {
    name: 'performance',
    icon: 'Performance2',
  };

  render() {
    const { FPS, ms, memorySize, memoryLimit } = this.props;
    const memory =
      memorySize.length > 0
        ? `${getLast(memorySize)} / ${memoryLimit} mb`
        : 'N/A';
    return (
      <Panel>
        <Section>
          <Heading>Frames Per Second</Heading>
          <Content>
            <Value>{displayMetric(getLast(FPS))}</Value>
            <Chart>
              <PerformanceChart values={FPS} max={70} />
            </Chart>
          </Content>
        </Section>

        <Section>
          <Heading>Render Time</Heading>
          <Content>
            <Value>{displayMetric(getLast(ms))} ms</Value>
            <Chart>
              <PerformanceChart values={ms} max={200} />
            </Chart>
          </Content>
        </Section>

        <Section>
          <Heading>Memory</Heading>
          <Content>
            <Value>{memory}</Value>
            <Chart>
              <PerformanceChart values={memorySize} max={memoryLimit} />
            </Chart>
          </Content>
        </Section>
      </Panel>
    );
  }
}

export default withTheme(PerformancePanel);
