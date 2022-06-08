import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

import Control from './control';

const Container = styled.div`
  position: absolute;
  top: 46px;
  right: 0;
  bottom: 0;
  width: 225px;
  background: #111111;
  border-left: 1px solid #262626;
  box-sizing: border-box;
  color: white;
  overflow: auto;
`;

const Folder = styled.div`
  margin-bottom: 24px;
`;

const FolderLabel = styled.div`
  font-size: 12px;
  font-weight: bold;
  padding: 10px 16px;
  background: #191919;
  color: #d4d4d4;
`;

const ControlList = styled.div``;

const flicker = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
`;

const Connect = styled.div`
  width: 100%;
  height: 32px;
  background: ${(props) => props.theme.accent};
  max-height: ${(props) => (props.connect ? '100%' : 0)};
  transition: max-height 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 11px;
  overflow: hidden;

  span {
    animation: ${flicker} 1s ease;
    animation-iteration-count: infinite;
  }
`;

class ControlsPanel extends Component {
  renderFolder(folder) {
    const path = `${this.props.path}.${folder.slug}`;
    return (
      <Folder key={path}>
        <FolderLabel>{folder.label}</FolderLabel>
        <ControlList>
          {folder.controls.map((c) => (
            <Control
              component={this.props.getControl(c.type)}
              control={c}
              path={path}
              updateControl={this.props.updateControl}
              connect={this.props.connect}
              connectEnd={this.props.connectEnd}
            />
          ))}
        </ControlList>
      </Folder>
    );
  }

  render() {
    const {
      connect,
      connectEnd,
      controls,
      layers,
      getControl,
      updateControl,
      path,
    } = this.props;
    return (
      <Container>
        <Connect connect={connect}>
          <span>Click to connect control</span>
        </Connect>
        <ControlList>
          {controls.map((c) => (
            <Control
              component={getControl(c.type)}
              control={c}
              path={path}
              updateControl={updateControl}
              connect={connect}
              connectEnd={connectEnd}
            />
          ))}
        </ControlList>
        {layers.map((f) => f.isFolder && this.renderFolder(f))}
      </Container>
    );
  }
}

export default ControlsPanel;
