import React, { Component } from 'react';
import styled from 'styled-components';
import Color from '@magic-circle/colors';

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 36px;
`;
const Row = styled.div`
  display: flex;
  background: ${props =>
    props.selected
      ? new Color(props.theme.accent).alpha(0.9).toCSS()
      : '#191919'};
  border-radius: ${props => (props.selected ? 3 : 0)}px;
  font-weight: ${props =>
    props.selected || props.heading ? 'bold' : 'normal'};
  border-bottom: ${props =>
    props.heading ? '1px solid rgba(100, 100, 100, 0.6)' : 'none'};

  &:nth-of-type(even) {
    background: ${props =>
      props.selected
        ? new Color(props.theme.accent).alpha(0.9).toCSS()
        : '#111111'};
  }
`;
const Column = styled.div`
  font-size: 12px;
  line-height: 42px;
  padding-left: 12px;
  color: white;
  box-sizing: border-box;
  cursor: default;
  width: 50%;
`;

const Button = styled.button`
  border: 1px solid ${props => props.theme.accent};
  color: ${props => props.theme.accent};
  display: block;
  text-align: center;
  user-select: none;
  font-size: 12px;
  font-size: 14px;
  padding: 3px 12px;
  border-radius: 3px;
  margin: 0 auto;
  background: none;
  outline: none;
`;

class MidiPanel extends Component {
  static navigation = {
    name: 'midi',
    icon: 'Usb',
  };

  render() {
    const { config } = this.props.presets[this.props.active.preset];
    return (
      <Panel>
        <Table>
          <Row heading>
            <Column>MIDI signal</Column>
            <Column>Control key</Column>
          </Row>
          {config.map(() => (
            <Row>
              <Column>ch1 e5</Column>
              <Column>layers1.x</Column>
            </Row>
          ))}
        </Table>
        <Button onClick={() => this.props.addRow()}>add row</Button>
      </Panel>
    );
  }
}

export default MidiPanel;
