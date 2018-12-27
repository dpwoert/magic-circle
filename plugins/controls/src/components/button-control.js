import React from 'react';
import styled from 'styled-components';

import {Row, Label, Center, Value, TextBox} from './styles';

const Button = styled(Label)`
  width: auto;
  cursor: pointer;
  color: ${props => props.theme.accent};
`;

const ButtonControl = props => {
  const { label, updateControl } = props;
  return (
    <Row>
      <Button onClick={() => updateControl('')}>{label}</Button>
    </Row>
  );
};

ButtonControl.type = 'button';
ButtonControl.noReset = true;
export default ButtonControl;
