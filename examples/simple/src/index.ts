import { MagicCircle, PluginScreenshot } from '@magic-circle/client';
import { setup, loop } from './example-scene';

new MagicCircle([PluginScreenshot]).setup(setup).loop(loop);
