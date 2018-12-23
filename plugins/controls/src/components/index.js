import TextControl from './text-control';
import FloatControl from './float-control';
import ColorControl from './color-control';
import BooleanControl from './boolean-control';

const controls = [
  TextControl,
  FloatControl,
  BooleanControl,
  ColorControl,
];

export const addControl = c => controls.push(c);
export const getControl = name => controls.find(c => name === c.type);
