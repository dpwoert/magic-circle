import React from 'react';
import styled from 'styled-components';
import Color from '@creative-controls/colors';

import { Row, Label, Center, Value } from './styles';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  cursor: grab;
  background: rgba(100, 100, 100, 0.1);
`;

const Slider = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  background: none;
  cursor: grab;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 2px;
    height: 20px;
    background: ${props => props.theme.accent};
    cursor: grab;
  }

  &::-webkit-slider-runnable-track {
    height: 20px;
    background: none;
  }

  &:focus {
    outline: none;
  }
`;

const Progress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => props.progress}%;
  height: 100%;
  background: ${props => new Color(props.theme.accent).alpha(0.2).toCSS()};
  cursor: grab;
`;

const FloatControl = props => {
  const { value, options, updateControl } = props;
  const { range, stepSize } = options;
  const progress =
    ((value - parseInt(range[0], 10)) * 100) /
    (parseInt(range[1], 10) - parseInt(range[0], 10));
  const extent = Math.abs(parseInt(range[1], 10) - parseInt(range[0], 10));
  const step = stepSize === 0 ? extent / 100 : stepSize;

  return (
    <Row>
      <Label>{props.label}</Label>
      <Center>
        <InputContainer>
          <Progress progress={progress} />
          <Slider
            value={value}
            onChange={evt => {
              updateControl(+evt.target.value);
            }}
            type="range"
            min={parseInt(range[0], 10)}
            max={parseInt(range[1], 10)}
            step={step}
          />
        </InputContainer>
      </Center>
      <Value>{props.value}</Value>
    </Row>
  );
};

FloatControl.type = 'float';
export default FloatControl;
