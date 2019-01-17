import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const ResizePanel = styled.div`
  padding: 16px;
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
`;

const AxisInput = styled.input`
  flex: 1;
  background: #191919;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 6px;
`;

const Screenshots = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const Screenshot = styled.li`
  width: 100%;
  margin-bottom: 16px;
`;

const ImageFrame = styled.div`
  width: 100%;
  padding-top: 56%;
  background: url('${props => props.image}');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.div`
  color: #fff;
  margin-top: 8px;
  font-size: 12px;
`;

const Delete = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;

  fill: ${props => props.theme.accent};
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 70%;
    height: auto;
  }
`;

class ScreenshotsPanel extends Component {
  static navigation = {
    name: 'screenshots',
    icon: 'CameraRoll',
  };

  state = {
    customSize: false,
    x: 1080,
    y: 720,
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

  render() {
    const { screenshots, path, loadScreenshot, deleteScreenshot } = this.props;
    const DeleteIcon = this.props.theme.icons.Trashbin;

    return (
      <Panel>
        <ResizePanel>
          <WindowSize
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
            <option>800x600</option>
            <option>1024x768</option>
            <option>1080x720</option>
            <option>1920x1080</option>
            <option>3840×2160</option>
            <option>custom</option>
          </WindowSize>
          <CustomSize show={this.state.customSize}>
            <SizeRow>
              <Axis>x</Axis>
              <AxisInput
                onChange={evt => this.setCustomAxis('x', evt.target.value)}
                value={this.state.x}
              />
            </SizeRow>
            <SizeRow>
              <Axis>y</Axis>
              <AxisInput
                onChange={evt => this.setCustomAxis('y', evt.target.value)}
                value={this.state.y}
              />
            </SizeRow>
          </CustomSize>
        </ResizePanel>
        <Screenshots>
          {screenshots.map(screenshot => (
            <Screenshot
              key={screenshot}
              onClick={() => loadScreenshot(screenshot)}
            >
              <ImageFrame image={`${path}/${screenshot}.png`} />
              <Details>
                <Name>{screenshot.replace('screenshot ', '')}</Name>
                <Delete onClick={() => deleteScreenshot(screenshot)}>
                  <DeleteIcon />
                </Delete>
              </Details>
            </Screenshot>
          ))}
        </Screenshots>
      </Panel>
    );
  }
}

export default withTheme(ScreenshotsPanel);
