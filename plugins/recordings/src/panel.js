/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const ResizePanel = styled.div`
  padding: 16px;
  padding-left: 6px;
  background: #191919;
`;

const WindowSize = styled.select`
  width: 100%;
  background: #191919;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 6px;
  height: 25px;
  padding-left: 0;
`;

const CustomSize = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  padding-top: 12px;
`;

const SizeRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 2px;
`;

const Axis = styled.div`
  color: ${props => props.theme.accent};
  padding-right: 6px;
  width: 85px;
  padding-left: 8px;
`;

const AxisInput = styled.input`
  width: 100%;
  background: #191919;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 6px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const Button = styled.div`
  position: relative;
  border: 1px solid ${props => props.theme.accent};
  border-radius: 2px;
  color: ${props => props.theme.accent};
  display: block;
  text-align: center;
  user-select: none;
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  background: none;
  margin-top: 12px;
  opacity: ${props => (props.isDisabled ? 0.5 : 1)};

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => (props.procent || 0) * 100}%;
    height: 100%;
    background: ${props => props.theme.accent};
    opacity: 0.2;
  }
`;

class RecordPanel extends Component {
  static navigation = {
    name: 'record',
    icon: 'Performance',
  };

  state = {
    customSize: false,
    width: window.innerWidth,
    height: window.innerHeight,
    fps: 60,
    duration: 15,
  };

  changeWindowSize(width, height) {
    this.props.resize('frame', width, height);
    this.setState({
      x: width,
      y: height,
    });
  }

  setCustomAxis(axis, value) {
    if (axis === 'x') {
      this.changeWindowSize(parseInt(value, 10), this.state.y);
    } else if (axis === 'y') {
      this.changeWindowSize(this.state.x, parseInt(value, 10));
    }
  }

  changeOption(key, val) {
    this.setState({
      [key]: parseInt(val, 10),
    });
  }

  render() {
    const {
      done,
      total,
      resolutions,
      finishedRecording,
      enableFFMPEG,
    } = this.props;
    const percent = total > 0 ? Math.floor((done / total) * 100) : 0;
    const currentRes = `${this.state.width}x${this.state.height}`;
    const sizeValue =
      resolutions.indexOf(currentRes) > -1 ? currentRes : 'custom';
    const recordStarted = done > 0 && !finishedRecording;

    return (
      <Panel>
        <ResizePanel>
          <WindowSize
            defaultValue={sizeValue}
            onChange={evt => {
              const { value } = evt.target;

              if (value !== 'custom') {
                const sizes = value.split('x');
                this.changeWindowSize(+sizes[0], +sizes[1]);
                this.setState({ customSize: false });
              } else {
                this.setState({ customSize: true });
              }
            }}
          >
            {resolutions.map(res => (
              <option value={res}>{res}</option>
            ))}
            <option value="custom">custom</option>
          </WindowSize>
          <CustomSize show={sizeValue === 'custom' || this.state.customSize}>
            <SizeRow>
              <Axis>width</Axis>
              <AxisInput
                onChange={evt => this.setCustomAxis('x', evt.target.value)}
                value={this.state.width}
              />
            </SizeRow>
            <SizeRow>
              <Axis>height</Axis>
              <AxisInput
                onChange={evt => this.setCustomAxis('y', evt.target.value)}
                value={this.state.height}
              />
            </SizeRow>
          </CustomSize>
          <SizeRow>
            <Axis>duration</Axis>
            <AxisInput
              onChange={evt => this.changeOption('duration', evt.target.value)}
              value={this.state.duration}
            />
          </SizeRow>
          <SizeRow>
            <Axis>fps</Axis>
            <AxisInput
              onChange={evt => this.changeOption('fps', evt.target.value)}
              value={this.state.fps}
            />
          </SizeRow>
        </ResizePanel>
        <ButtonRow>
          <Button
            onClick={() => this.props.startRecording(this.state)}
            procent={percent / 100}
          >
            {recordStarted
              ? `${percent}% (${done}/${total})`
              : 'Start recording'}
          </Button>
          {enableFFMPEG && (
            <Button
              isDisabled={this.props.converting}
              onClick={() => this.props.convert(this.state)}
            >
              Convert to video
            </Button>
          )}
        </ButtonRow>
      </Panel>
    );
  }
}

export default withTheme(RecordPanel);
