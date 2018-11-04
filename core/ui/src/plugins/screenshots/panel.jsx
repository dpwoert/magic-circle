import React, { Component } from 'react';
import styled from 'styled-components';

// import withLayers, { setActiveLayer } from './with-layers';

const Panel = styled.ul`
  width: 100%;
  height: 100%;
`;

class ScreenshotsPanel extends Component {

  static navigation = {
    name: 'screenshots',
    icon: '',
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
