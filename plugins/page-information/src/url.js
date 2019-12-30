import React from 'react';
import styled from 'styled-components';
import Color from '@magic-circle/colors';

import EXAMPLES from './examples.json';

const Container = styled.div`
  height: 25px;
  font-size: 12px;
  font-weight: bold;
  color: #eee;
  text-align: center;
  width: 480px;
  border: 1px solid ${props => props.theme.accent};
  border-radius: 3px;
  background: none;
  display: flex;
  pointer-events: all;
  overflow: hidden;
`;

const OptionWrapper = styled.div`
  background: ${props => new Color(props.theme.accent).alpha(0.15).toCSS()};
`;

const Options = styled.select`
  background: none;
  border: none;
  height: 100%;
  width: 100px;
  appearance: none;
  padding: 5px;
  color: ${props => props.theme.accent};
  font-size: 10px;
  outline: none;
`;

const Arrow = styled.div`
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 5px 0 5px;
  border-color: ${props => props.theme.accent} transparent transparent
    transparent;
  margin-right: 3px;
`;

const Input = styled.input`
  color: ${props => props.theme.accent};
  background: none;
  border: none;
  flex: 1;
  padding: 5px;
  padding-left: 10px;

  &:focus {
    outline: none;
    color: #fff;
  }
`;

const URL = ({ location, changeUrl }) => {
  const isLocal =
    location.host === 'magic-circle.surge.sh' || location.protocol === 'file:';
  const url = isLocal ? location.pathname : location.href;

  return (
    <Container>
      <OptionWrapper>
        <Options
          onChange={evt => {
            changeUrl(evt.target.value);
          }}
        >
          {EXAMPLES.map(ex => (
            <option value={ex.url}>{ex.label}</option>
          ))}
        </Options>
        <Arrow />
      </OptionWrapper>
      <Input
        onBlur={evt => changeUrl(evt.target.value)}
        onKeyDown={evt => {
          if (evt.key === 'Enter') {
            changeUrl(evt.target.value);
            evt.target.blur();
          }
        }}
        defaultValue={url}
      />
    </Container>
  );
};

export default URL;
