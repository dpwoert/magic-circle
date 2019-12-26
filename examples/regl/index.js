import { Controls } from '@magic-circle/client';
import exampleScene from './example-scene';

const controls = new Controls();
const scene = exampleScene();

controls.setup(scene.setup).loop(scene.loop);
