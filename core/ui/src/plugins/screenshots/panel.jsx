import React, { Component } from 'react';
import styled from 'styled-components';

// import withLayers, { setActiveLayer } from './with-layers';

import cameraRollIcon from '../../../assets/camera-roll.svg';

const Panel = styled.ul`
  width: 100%;
  height: 100%;
`;

class ScreenshotsPanel extends Component {

  static navigation = {
    name: 'screenshots',
    icon: cameraRollIcon,
  };

  render(){
    return(
      <Panel>
        screenshots here
      </Panel>
    )
  }

}

export default ScreenshotsPanel;
