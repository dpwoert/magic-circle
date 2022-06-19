import createSketch from './wrapper';
import { sketch } from './example-scene';

import './style.css';

createSketch(sketch, document.querySelector('#p5')).start();
