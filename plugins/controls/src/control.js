import React, { Component } from 'react';
import styled, { withTheme, keyframes } from 'styled-components';
import shallowEqual from 'shallowequal';
import Color from '@magic-circle/colors';

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
  background: ${(props) => (props.changed ? props.theme.accent : 'none')};
`;

const Link = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: ${(props) => new Color(props.theme.accent).alpha(0.7).toCSS()};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  box-shadow: 0px 0px 6px 0px black;
  opacity: 0;
  pointer-events: ${(props) => (props.connect ? 'all' : 'none')};

  ${Wrapper}:hover & {
    opacity: ${(props) => (props.connect ? 1 : 0)};
  }

  svg {
    width: 16px;
    height: 16px;
    fill: #fff;
  }
`;

const flicker = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
  }
`;

const LinkIndicator = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: #000;
  animation: ${flicker} 2s ease;
  animation-iteration-count: infinite;
  z-index: 4;
  pointer-events: none;
  display: ${(props) => (props.connect ? 'block' : 'none')};

  ${Wrapper}:nth-of-type(2n) & {
    animation-delay: 0.5s;
  }
`;

const Reset = styled.div`
  position: absolute;
  width: 30px;
  height: 100%;
  left: 0;
  top: 0;
  background: ${(props) => props.theme.accent};
  transform: translateX(-100%);
  display: ${(props) => (props.changed ? 'flex' : 'none')};
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
    const { control, component, connect, connectEnd } = this.props;
    const { value, original } = this.state;
    const CustomControl = component;
    const changed = !shallowEqual(original, value) && !CustomControl.noReset;
    const LinkIcon = this.props.theme.icons.Link;

    if (!CustomControl) {
      return <div>control not found: {control.type}</div>;
    }

    return (
      <Wrapper>
        <Hitbox onClick={() => this.reset()}>
          <Reset changed={changed}>↻</Reset>
          <Indicator changed={changed} />
        </Hitbox>
        <LinkIndicator connect={connect && CustomControl.connect} />
        <Link
          connect={connect && CustomControl.connect}
          onClick={() => {
            if (connect) {
              connectEnd(control.path);
            }
          }}
        >
          <LinkIcon />
        </Link>
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

export default withTheme(Control);
