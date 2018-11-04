import TextControl from './text-control.jsx';
import FloatControl from './float-control.jsx';
import ColorControl from './color-control.jsx';

const controls = [
  TextControl,
  FloatControl,
  ColorControl
];

export const addControl = c => controls.push(c);
export const getControl = name => controls.find(c => name === c.type);
