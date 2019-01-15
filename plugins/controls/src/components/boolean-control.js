import React from 'react';
import styled from 'styled-components';
import Color from '@creative-controls/colors';

import { Row, Label, Center, Value, TextBox } from './styles';

const Box = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border: 1px solid ${props => new Color(props.theme.accent).alpha(0.5).toCSS()};
  border-radius: 3px;
  background: ${props => new Color(props.theme.accent).alpha(0).toCSS()};

  transition: border 0.2s ease, background 0.2s ease;

  &:after {
  }
`;

const Input = styled.input`
  position: absolute;
  visibility: hidden;

  &:checked + ${Box} {
    border: 1px solid ${props => props.theme.accent};
    background: ${props => new Color(props.theme.accent).alpha(0.25).toCSS()};
  }
`;

const BooleanControl = props => {
  const { value, options, updateControl } = props;
  return (
    <Row>
      <Label>{props.label}</Label>
      <Center />
      <Value>
        <label>
          <Input
            onChange={() => updateControl(!props.value)}
            checked={props.value}
            type="checkbox"
          />
          <Box />
        </label>
      </Value>
    </Row>
  );
};

BooleanControl.type = 'boolean';
export default BooleanControl;
