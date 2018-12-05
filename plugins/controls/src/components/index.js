import TextControl from './text-control';
import FloatControl from './float-control';
// import ColorControl from './color-control';

const controls = [
  TextControl,
  FloatControl,
  // ColorControl
];

export const addControl = c => controls.push(c);
export const getControl = name => controls.find(c => name === c.type);
