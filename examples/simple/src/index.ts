import { MagicCircle } from '@magic-circle/client';
import { setup, loop } from './example-scene';

import './style.css';

new MagicCircle().setup(setup).loop(loop).start();
