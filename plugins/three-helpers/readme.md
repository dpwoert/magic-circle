# @CreativeControls/ThreeHelpers
Helpers for creating standard THREEjs controls easily

## Example
```js
import { Controls } from '@magic-circle/client';
import ThreeControls from '@magic-circle/three-helpers';
import * as THREE from 'three';

const controls = new Controls(ThreeControls(THREE));

const scene = new THREE.Scene();
scene.name = 'Main';

// recursively go through scene
controls.scene(scene);

```
