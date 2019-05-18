/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

class MidiPanel extends Component {
  static navigation = {
    name: 'midi',
    icon: 'Usb',
  };

  state = {};

  render() {
    return <Panel>todo</Panel>;
  }
}

export default withTheme(MidiPanel);
