import { Controls } from '@magic-circle/client';

import { setup, loop } from './example-scene';

const controls = new Controls();

controls.setup(setup).loop(loop);
