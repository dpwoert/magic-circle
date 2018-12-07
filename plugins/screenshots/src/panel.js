import React, { Component } from 'react';
import styled from 'styled-components';

const cameraRollIcon = 'assets/camera-roll.svg';

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

const Name = styled.div`
  color: #fff;
  margin-top: 8px;
  font-size: 12px;
`


class ScreenshotsPanel extends Component {

  static navigation = {
    name: 'screenshots',
    icon: cameraRollIcon,
  };

  render(){
    const {screenshots, path, loadScreenshot} = this.props;
    return(
      <Panel>
        <Screenshots>
          {screenshots.map(screenshot => (
            <Screenshot key={screenshot} onClick={() => loadScreenshot(screenshot)}>
              <ImageFrame image={`${path}/${screenshot}.png`} />
              <Name>{screenshot.replace('screenshot ', '')}</Name>
            </Screenshot>
          ))}
        </Screenshots>
      </Panel>
    )
  }

}

export default ScreenshotsPanel;
