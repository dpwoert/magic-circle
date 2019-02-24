import React, { Component } from 'react';
import styled from 'styled-components';
import shallowEqual from 'shallowequal';

import { getControl } from './components';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const Hitbox = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 100%;
  z-index: 3;
`;

const Indicator = styled.div`
  position: absolute;
  width: 3px;
  height: 100%;
  left: 0;
  top: 0;
  background: ${props => (props.changed ? props.theme.accent : 'none')};
`;

const Reset = styled.div`
  position: absolute;
  width: 30px;
  height: 100%;
  left: 0;
  top: 0;
  background: ${props => props.theme.accent};
  transform: translateX(-100%);
  display: ${props => (props.changed ? 'flex' : 'none')};
  transition: transform 0.2s ease;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  cursor: pointer;

  ${Hitbox}:hover & {
    transform: translateX(0);
  }
`;

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      original: props.control.initialValue,
      value: props.control.value,
    };
    this.updateControl = this.updateControl.bind(this);
  }

  componentWillReceiveProps(next) {
    if (next.control.value !== this.props.control.value) {
      this.setState({ value: next.control.value });
    }
  }

  updateControl(value) {
    this.setState({ value });
    const { control, path } = this.props;
    const cPath = `${path}.${control.key}`;
    this.props.updateControl(cPath, value);
  }

  reset() {
    this.updateControl(this.state.original);
  }

  render() {
    const { control, component } = this.props;
    const { value, original } = this.state;
    const CustomControl = component;
    const changed = !shallowEqual(original, value) && !CustomControl.noReset;

    if (!CustomControl) {
      return <div>control not found: {control.type}</div>;
    }

    return (
      <Wrapper>
        <Hitbox onClick={() => this.reset()}>
          <Reset changed={changed}>↻</Reset>
          <Indicator changed={changed} />
        </Hitbox>
        <CustomControl
          {...control}
          value={value}
          updateControl={this.updateControl}
          changed={changed}
        />
      </Wrapper>
    );
  }
}

export default Control;
