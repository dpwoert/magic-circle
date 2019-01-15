import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
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

  render() {
    const { screenshots, path, loadScreenshot, deleteScreenshot } = this.props;
    const DeleteIcon = this.props.theme.icons.Trashbin;
    return (
      <Panel>
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
