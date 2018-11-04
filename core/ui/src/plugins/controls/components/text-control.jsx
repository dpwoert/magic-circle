import React from 'react';
import styled from 'styled-components';

import {Row, Label, Center, Value, TextBox} from './styles';

const TextControl = props => {
  return (
    <Row>
      <Label>{props.label}</Label>
      <Center>
        <TextBox
          value={props.value}
          onChange={evt => { props.updateControl(evt.target.value) }}
        />
      </Center>
    </Row>
  );
};

TextControl.type = 'text';
export default TextControl;
