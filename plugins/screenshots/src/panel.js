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
  width: 75px;
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
  border-radius: 3px;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Meta = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-weight: bold;
  color: #fff;
  margin-top: 8px;
  font-size: 12px;
`;

const NameInput = styled.input`
  color: ${props => props.theme.accent};
  margin-top: 8px;
  font-size: 12px;
  border: none;
  background: none;

  &:focus {
    outline: none;
  }
`;

const MetaData = styled.div`
  color: #ddd;
  margin-top: 8px;
  font-size: 10px;
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

const truncate = (string, max) =>
  string.length > max ? `${string.substring(0, max)}...` : string;

const parseDate = str => {
  const d = new Date(str);
  const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const time = `${d.getHours()}:${d.getMinutes()}`;
  return `${date} ${time}`;
};

class ScreenshotsPanel extends Component {
  static navigation = {
    name: 'screenshots',
    icon: 'CameraRoll',
  };

  state = {
    editName: null,
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

  toggleRenaming(evt, screenshot) {
    evt.preventDefault();
    this.setState({ editName: screenshot.fileName });

    setTimeout(() => {
      if (this.inputRef) {
        this.inputRef.focus();
      }
    }, 24);
  }

  renameScreenshot(evt, screenshot) {
    if (confirm('Are you sure you want to rename this screenshot?')) {
      this.props.renameScreenshot(screenshot.fileName, evt.target.value);
    }
    this.setState({ editName: null });
  }

  render() {
    const {
      screenshots,
      path,
      loadScreenshot,
      deleteScreenshot,
      resolutions,
    } = this.props;
    const currentRes = `${window.innerWidth}x${window.innerHeight}`;
    const sizeValue =
      resolutions.indexOf(currentRes) > -1 ? currentRes : 'custom';

    const DeleteIcon = this.props.theme.icons.Trashbin;

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
          <CustomSize show={this.state.customSize || sizeValue === 'custom'}>
            <SizeRow>
              <Axis>width</Axis>
              <AxisInput
                onChange={evt => this.setCustomAxis('x', evt.target.value)}
                value={this.state.x}
              />
            </SizeRow>
            <SizeRow>
              <Axis>height</Axis>
              <AxisInput
                onChange={evt => this.setCustomAxis('y', evt.target.value)}
                value={this.state.y}
              />
            </SizeRow>
          </CustomSize>
        </ResizePanel>
        <Screenshots>
          {screenshots.map(screenshot => (
            <Screenshot key={screenshot.fileName}>
              <ImageFrame
                image={`${path}/${screenshot.fileName}.png`}
                onClick={() => loadScreenshot(screenshot.fileName)}
              />
              <Details>
                <Meta>
                  {this.state.editName !== screenshot.fileName ? (
                    <Name
                      onDoubleClick={evt =>
                        this.toggleRenaming(evt, screenshot)
                      }
                    >
                      {truncate(screenshot.meta.name, 20)}
                    </Name>
                  ) : (
                    <NameInput
                      ref={r => {
                        this.inputRef = r;
                      }}
                      defaultValue={screenshot.meta.name}
                      onBlur={evt => this.renameScreenshot(evt, screenshot)}
                      onKeyPress={() => {
                        // if (evt.keyCode === 0) {
                        //   this.renameScreenshot(evt, screenshot);
                        // }
                      }}
                    />
                  )}
                  <MetaData>{parseDate(screenshot.meta.createdAt)}</MetaData>
                  {screenshot.git && (
                    <MetaData>
                      {screenshot.git.branch}
                      {screenshot.git.lastTag && ` - ${screenshot.git.lastTag}`}
                    </MetaData>
                  )}
                </Meta>
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
