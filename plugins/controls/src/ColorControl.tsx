/* eslint-disable no-bitwise */
import { useState } from 'react';
import styled from 'styled-components';
import ColorPicker, { Color } from '@rc-component/color-picker';
import rgba from 'color-rgba';

import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import {
  TYPO,
  COLORS,
  Control,
  Forms,
  Popup,
  Placement,
} from '@magic-circle/styles';
import ColorControlGlobal from './ColorControl.style';

import '@rc-component/color-picker/assets/index.css';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

const ColorValue = styled.div`
  ${TYPO.input}
  color: ${COLORS.shades.s200.css};
`;

type colorRgb = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

type colorRgb2 = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};

type color = string | number | number[] | colorRgb | colorRgb2;

type options = {
  alpha?: boolean;
  range?: number;
  rangeAlpha?: number;
};

const toHexDigit = (number: number, range: number) => {
  const numberSafe = number * (255 / range);
  return (numberSafe | (1 << 8)).toString(16).slice(1);
};

const toHex = (color: number[], range: number) => {
  const values = [
    '#',
    toHexDigit(color[0], range),
    toHexDigit(color[1], range),
    toHexDigit(color[2], range),
  ];

  return values.join('');
};

const toRgbString = (color: number[], range: number, rangeAlpha: number) => {
  const r = color[0] * (255 / range);
  const g = color[1] * (255 / range);
  const b = color[2] * (255 / range);
  const a = color[3] * (255 / rangeAlpha);

  return `rgba(${r},${g},${b},${a})`;
};

type ColorTriggerProps = {
  color: string;
};

const ColorTrigger = styled.div<ColorTriggerProps>`
  border: none;
  box-shadow: none;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  display: inline-block;
  padding: 2px;
  border-radius: 2px;
  user-select: none;
  cursor: pointer;
  background-color: ${(props) => props.color};
`;

const ColorControlField = ({
  value,
  label,
  set,
  hasChanges,
  options,
  reset,
}: ControlProps<color, options>) => {
  let color = []; // [r: 255, g: 255, b: 255, a: 100]
  const { alpha } = options;
  const range = options.range || 255;
  const rangeAlpha = options.rangeAlpha || 1;
  const [showPopup, setShowPopup] = useState(false);

  if (typeof value === 'string') {
    color = rgba(value) || [0, 0, 0];
  } else if (typeof value === 'number') {
    color = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  } else if (Array.isArray(value)) {
    color = value.map((v, k) =>
      k < 3 ? v * (255 / range) : v * (100 / rangeAlpha)
    );
  } else {
    const a1 = 'a' in value && value.a;
    const a2 = 'alpha' in value && value.alpha;
    color = [
      ('r' in value ? value.r : value.red) * (255 / range),
      ('g' in value ? value.g : value.green) * (255 / range),
      ('b' in value ? value.b : value.blue) * (255 / range),
      (a1 || a2 || rangeAlpha) * (100 / rangeAlpha),
    ];
  }

  const hex = toHex(color, 255);
  const pickerColor = new Color({
    r: color[0],
    g: color[1],
    b: color[2],
    a: alpha ? color[3] : 100,
  });

  return (
    <Control.Container hasChanges={hasChanges} reset={reset}>
      <Control.Label>{label}</Control.Label>
      <Control.Inside>
        <Forms.Color>
          <ColorControlGlobal />
          <Popup
            content={
              <ColorPicker
                color={pickerColor}
                onChange={(c) => {
                  const newHex = c.toHexString();
                  const newAlpha = c.getAlpha();

                  const newColor: number[] = [
                    ...(rgba(newHex) || [0, 0, 0]),
                    newAlpha * (rangeAlpha / 100),
                  ];
                  let newColorConverted: typeof value;

                  // convert to old format
                  if (typeof value === 'string' && alpha) {
                    newColorConverted = toRgbString(newColor, 255, 1);
                  } else if (typeof value === 'string' && !alpha) {
                    newColorConverted = toHex(newColor, 255);
                  } else if (typeof value === 'number') {
                    newColorConverted =
                      (clamp(newColor[0], 0, 255) << 16) ^
                      (clamp(newColor[1], 0, 255) << 8) ^
                      (clamp(newColor[2], 0, 255) << 0);
                  } else if (Array.isArray(value)) {
                    newColorConverted = newColor.map((v, k) =>
                      k < 3 ? v * (range / 255) : v * (rangeAlpha / 100)
                    );
                  } else if (typeof value === 'object' && 'r' in value) {
                    newColorConverted = {
                      r: newColor[0] * (range / 255),
                      g: newColor[1] * (range / 255),
                      b: newColor[2] * (range / 255),
                      a: newColor[3] * (rangeAlpha / 100),
                    };
                  } else {
                    newColorConverted = {
                      red: newColor[0] * (range / 255),
                      green: newColor[1] * (range / 255),
                      blue: newColor[2] * (range / 255),
                      alpha: newColor[3] * (rangeAlpha / 100),
                    };
                  }

                  set(newColorConverted);
                }}
                // placement="bottomRight"
                disabledAlpha={!alpha}
              />
            }
            showOnClick
            placement={Placement.LEFT}
          >
            <ColorTrigger
              color={hex}
              onClick={() => setShowPopup(!showPopup)}
            />
          </Popup>
          <ColorValue>{alpha ? toRgbString(color, 255, 1) : hex}</ColorValue>
        </Forms.Color>
      </Control.Inside>
    </Control.Container>
  );
};

const ColorControl: ControlSchema<color, options> = {
  name: 'color',
  render: (props) => {
    return <ColorControlField {...props} />;
  },
};

export default ColorControl;
