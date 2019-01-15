import React from 'react';

import { Row, Label, Center, TextBox, Selection } from './styles';

const TextControl = props => {
  const { values, labels } = props.options;
  const labelList = labels && values.length === labels.length ? labels : values;
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
