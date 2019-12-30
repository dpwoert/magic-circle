import React, { Component } from 'react';
import styled from 'styled-components';
import Color from '@magic-circle/colors';

import { Row, Label, Center, Value, TextBox } from './styles';

const NumberBox = styled(TextBox)`
  cursor: ns-resize;
`;

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
  left: ${props => props.left};
  width: ${props => props.width}%;
  height: 100%;
  background: ${props => new Color(props.theme.accent).alpha(0.2).toCSS()};
  cursor: grab;
`;

const mapLinear = (x, a1, a2, b1, b2) =>
  b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

const STEP_SIZE = 25;

class StepControl extends Component {
  constructor(props) {
    super(props);
    this.drag = this.drag.bind(this);
    this.endDrag = this.endDrag.bind(this);
  }

  startDrag(e) {
    this.dragStart = e.clientY;
    this.dragValue = parseInt(this.props.value, 10);

    window.addEventListener('mousemove', this.drag);
    window.addEventListener('mouseup', this.endDrag);

    document.querySelector('body').style.cursor = 'ns-resize';
  }

  drag(e) {
    const delta = e.clientY - this.dragStart;
    const steps = Math.floor(delta / STEP_SIZE);
    const stepSize = this.props.options.stepSize || 1;

    this.props.updateControl(this.dragValue + steps * stepSize);
  }

  endDrag() {
    document.querySelector('body').style.cursor = 'auto';
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.endDrag);
  }

  render() {
    const { label, value, updateControl } = this.props;
    return (
      <Row>
        <Label>{label}</Label>
        <Center>
          <NumberBox
            value={value}
            onMouseDown={e => this.startDrag(e)}
            onChange={evt => {
              updateControl(evt.target.value);
            }}
          />
        </Center>
      </Row>
    );
  }
}

const ContiousControl = props => {
  const { value, options, updateControl } = props;
  const { range, stepSize } = options;
  const biDirectional = Math.abs(range[0]) === Math.abs(range[1]);

  const progress =
    ((value - parseInt(range[0], 10)) * 100) /
    (parseInt(range[1], 10) - parseInt(range[0], 10));
  const extent = Math.abs(parseInt(range[1], 10) - parseInt(range[0], 10));
  const step = stepSize === 0 ? extent / 100 : stepSize;

  const x1 = mapLinear(0, range[0], range[1], 0, 100);
  const x2 = mapLinear(value, range[0], range[1], 0, 100);
  const width = biDirectional ? Math.abs(x1 - x2) : progress;
  const left = biDirectional ? Math.min(x1, x2) : 0;

  return (
    <Row>
      <Label>{props.label}</Label>
      <Center>
        <InputContainer>
          <Progress left={left} width={width} />
          <Slider
            value={value}
            onChange={evt => {
              updateControl(+evt.target.value);
            }}
            type="range"
            min={parseFloat(range[0], 10)}
            max={parseFloat(range[1], 10)}
            step={step}
          />
        </InputContainer>
      </Center>
      <Value>{props.value}</Value>
    </Row>
  );
};

const NumberControl = props => (
  <>
    {props.options.range ? (
      <ContiousControl {...props} />
    ) : (
      <StepControl {...props} />
    )}
  </>
);

// const NumberControl = props => props.options.range ?
//   ContiousControl(props) : StepControl(props);

NumberControl.type = 'number';
NumberControl.connect = true;
export default NumberControl;
