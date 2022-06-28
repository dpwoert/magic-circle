import createSketch from './wrapper';
import { sketch } from './example-scene';

import './style.css';

const element = document.querySelector('#p5') as HTMLElement;

if (element) {
  createSketch(sketch, element).start();
}
