import { MagicCircle } from '@magic-circle/client';
import { setup, loop, resize } from './example-scene';

import './style.css';

new MagicCircle().setup(setup).loop(loop).resize(resize).start();
