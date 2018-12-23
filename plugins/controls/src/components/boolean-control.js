import React from 'react';
import styled from 'styled-components';

import {Row, Label, Center, Value, TextBox} from './styles';

const Box = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border: 1px solid rgba(136, 74, 255, 0.5);
  border-radius: 3px;
  background: rgba(136, 74, 255, 0);

  transition: border 0.2s ease, background 0.2s ease;

  &:after{

  }
`;

const Input = styled.input`
  position: absolute;
  visibility: hidden;

  &:checked + ${Box}{
    border: 1px solid rgba(136, 74, 255, 1);
    background: rgba(136, 74, 255, 0.25);
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
