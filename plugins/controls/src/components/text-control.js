import React from 'react';
import styled from 'styled-components';

import { Row, Label, Center, Value, TextBox, Selection } from './styles';

const TextControl = props => {
  const { values, labels } = props.options;
  const labelList = labels && values.length === values.length ? labels : values;
  return (
    <Row>
      <Label>{props.label}</Label>
      <Center>
        {!values ? (
          <TextBox
            value={props.value}
            onChange={evt => {
              props.updateControl(evt.target.value);
            }}
          />
        ) : (
          <Selection
            value={props.value}
            onChange={evt => {
              props.updateControl(evt.target.value);
            }}
          >
            {values.map((v, k) => (
              <option value={v} key={v}>
                {labelList[k]}
              </option>
            ))}
          </Selection>
        )}
      </Center>
    </Row>
  );
};

TextControl.type = 'text';
export default TextControl;
