import { Controls } from '@creative-controls/client';
import { setup, loop } from './example-scene';

const controls = new Controls();

controls.setup(setup).loop(loop);
