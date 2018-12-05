import React from 'react';
import styled from 'styled-components';
import ColorPicker from 'rc-color-picker';

import {Row, Label, Center, Value} from './styles';
import GlobalStyle from './color-control-style';

// const GlobalStyle = styled.div``;
// const ColorPicker = styled.div``;

const Color = styled.div`
  margin-right: 6px;
  opacity: 0.5;
`;

const componentToHex = c => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = color => {
  return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

const rgba = c => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;

const normaliseColor = color => {
  return {
    r: color.r * 255,
    g: color.g * 255,
    b: color.b * 255,
    a: color.a,
  }
}

const ColorControl = props => {
  const { value, options, label, updateControl } = props;
  const { alpha } = options;
  const normalised = normaliseColor(value);
  const color = alpha ? rgba(normalised) : rgbToHex(normalised);

  return (
    <GlobalStyle>
      <Row>
        <Label>{label}</Label>
        <Center right>
          <Color>{color}</Color>
          <ColorPicker
            color={rgbToHex(normalised)}
            alpha={value.a}
            onChange={(c) => {
              const rgb = hexToRgb(c.color);

              if(alpha){
                rgb.a = c.alpha / 100;
              }

              rgb.r = rgb.r / 255;
              rgb.g = rgb.g / 255;
              rgb.b = rgb.b / 255;

              updateControl(rgb);
            }}
            placement="bottomRight"
            enableAlpha={alpha}
          />
        </Center>
      </Row>
    </GlobalStyle>
  );
};

ColorControl.type = 'color';
export default ColorControl;
