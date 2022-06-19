import { MagicCircle } from '@magic-circle/client';
import exampleScene from './example-scene';

import './style.css';

window.addEventListener('load', () => {
  const scene = exampleScene();
  new MagicCircle().setup(scene.setup).loop(scene.loop);
});
