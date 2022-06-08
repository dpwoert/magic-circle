import React from 'react';
import styled from 'styled-components';
import ColorPicker from 'rc-color-picker';

import Color from '@magic-circle/colors';

import { Row, Label, Center } from './styles';
import GlobalStyle from './color-control-style';

const ColorValue = styled.div`
  margin-right: 6px;
  opacity: 0.5;
`;

const ColorControl = (props) => {
  const { value, options, label, updateControl } = props;
  const { alpha, range } = options;
  const color = new Color(value, range);

  return (
    <Row>
      <GlobalStyle />
      <Label>{label}</Label>
      <Center right>
        <ColorValue>{color.toHex()}</ColorValue>
        <ColorPicker
          color={color.toHex()}
          alpha={alpha ? color.toArray()[3] * (100 / 255) : 100}
          onChange={(c) => {
            const newColor = new Color(c.color);
            color.copyFrom(newColor);
            updateControl(color.get());
          }}
          placement="bottomRight"
          enableAlpha={alpha}
        />
      </Center>
    </Row>
  );
};

ColorControl.type = 'color';
export default ColorControl;
