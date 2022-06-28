import React, { Component } from 'react';
import styled from 'styled-components';
import Color from '@magic-circle/colors';

// class Color {
//   alpha(){
//     return this;
//   }
//   toCSS(){
//     return '';
//   }
// }

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
  background: ${(props) =>
    props.selected
      ? new Color(props.theme.accent).alpha(0.9).toCSS()
      : '#191919'};
  border-radius: ${(props) => (props.selected ? 3 : 0)}px;
  font-weight: ${(props) =>
    props.selected || props.heading ? 'bold' : 'normal'};
  border-bottom: ${(props) =>
    props.heading ? '1px solid rgba(100, 100, 100, 0.6)' : 'none'};

  &:nth-of-type(even) {
    background: ${(props) =>
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
  background: ${(props) => (props.edit ? props.theme.accent : 'none')};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  display: block;
  text-align: center;
  user-select: none;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 3px;
  background: none;
  outline: none;
  margin-right: 6px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const truncate = (string, max) =>
  string.length > max
    ? `…${string.substring(string.length - max, string.length)}`
    : string;

class MidiPanel extends Component {
  static navigation = {
    name: 'midi',
    icon: 'Usb',
  };

  state = {
    changing: false,
    mode: null,
    id: null,
  };

  change(id, mode) {
    const { connect, updateRow, store } = this.props;

    this.setState({
      changing: true,
      id,
      mode,
    });

    if (mode === 'path') {
      connect((path) => {
        updateRow(id, 'path', path);
        this.stopChange();
      });
      store.set('once', null);
    } else {
      connect(null);
      store.set('once', (command) => {
        updateRow(id, 'midi', command);
        this.stopChange();
      });
    }
  }

  stopChange() {
    this.setState({ changing: false, mode: null, id: null });
    this.props.connect(null);
    this.props.store.set('once', null);
  }

  render() {
    const { config } = this.props.presets[this.props.active];
    const { changing, id, mode } = this.state;
    return (
      <Panel>
        <Table>
          <Row heading>
            <Column>MIDI signal</Column>
            <Column>Control key</Column>
          </Row>
          {config.map((row) => {
            const editing = changing && id === row.id;
            return (
              <Row>
                <Column
                  edit={editing && mode === 'midi'}
                  onDoubleClick={() => this.change(row.id, 'midi')}
                >
                  {row.midi
                    ? `ch.${row.midi.channel} ${row.midi.note.octave}.${row.midi.note.name}`
                    : '--'}
                </Column>
                <Column
                  edit={editing && mode === 'path'}
                  onDoubleClick={() => this.change(row.id, 'path')}
                >
                  {row.path ? truncate(row.path, 12) : '--'}
                </Column>
              </Row>
            );
          })}
        </Table>
        <Buttons>
          {this.props.unsavedChanges && (
            <Button onClick={() => this.props.save()}>save</Button>
          )}
          {this.state.changing ? (
            <Button onClick={() => this.stopChange()}>stop edit</Button>
          ) : (
            <Button onClick={() => this.props.addRow()}>add row</Button>
          )}
        </Buttons>
      </Panel>
    );
  }
}

export default MidiPanel;
