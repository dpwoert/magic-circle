import { MagicCircle } from '@magic-circle/client';
import * as MC from '@magic-circle/client';
import { setup, loop } from './example-scene';

console.log({ MagicCircle, MC });

new MagicCircle().setup(setup).loop(loop);
