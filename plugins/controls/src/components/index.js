import TextControl from './text-control';
import NumberControl from './number-control';
import ColorControl from './color-control';
import BooleanControl from './boolean-control';
import ButtonControl from './button-control';

const controls = [
  TextControl,
  NumberControl,
  BooleanControl,
  ColorControl,
  ButtonControl,
];

export const addControl = c => controls.push(c);
export const getControl = name => controls.find(c => name === c.type);
