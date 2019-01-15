import React, { Component } from 'react';
import styled from 'styled-components';

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

class ControlsPanel extends Component {
  renderFolder(folder) {
    const path = `${this.props.path}.${folder.slug}`;
    return (
      <Folder key={path}>
        <FolderLabel>{folder.label}</FolderLabel>
        <ControlList>
          {folder.controls.map(c => (
            <Control
              control={c}
              path={path}
              updateControl={this.props.updateControl}
            />
          ))}
        </ControlList>
      </Folder>
    );
  }

  render() {
    const { controls } = this.props;
    return <Container>{controls.map(f => this.renderFolder(f))}</Container>;
  }
}

export default ControlsPanel;
