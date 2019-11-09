import {
  PerspectiveCamera,
  Scene,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  Color,
} from 'three';

import { SceneControls, CameraControls } from '@magic-circle/three-helpers';

let renderer;
let scene;
let camera;

const animation = { x: 0.005, y: 0.01 };

export function setup(gui) {
  // Create renderer
  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // create camera
  camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 400;

  // Create scene
  scene = new Scene();

  let i = 1;
  for (let x = 0; x < 2; x += 1) {
    for (let y = 0; y < 2; y += 1) {
      for (let z = 0; z < 2; z += 1) {
        const geometry = new BoxBufferGeometry(50, 50, 50);
        const material = new MeshBasicMaterial({ color: new Color('#ff0000') });
        const mesh = new Mesh(geometry, material);
        mesh.name = `Box ${i}`;
        scene.add(mesh);

        mesh.position.x = x * 100;
        mesh.position.y = y * 100;
        mesh.position.z = z * 100;

        i += 1;
      }
    }
  }

  gui.add(new CameraControls(camera));
  gui.add(new SceneControls('Main', scene));
}

export function loop() {
  scene.rotation.x += animation.x;
  scene.rotation.y += animation.y;
  renderer.render(scene, camera);
}
