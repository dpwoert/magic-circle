import { MagicCircle } from '@magic-circle/client';

import Viewer from './Viewer';

import './style.css';

export default function start(): Viewer {
  const viewer = new Viewer();

  // create magic circle
  new MagicCircle()
    .setup(viewer.setup)
    .loop(viewer.tick)
    .resize(viewer.resize)
    .start();

  return viewer;
}
