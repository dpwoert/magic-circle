import {
  PerspectiveCamera,
  Scene,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  Color,
} from 'three';

import {
  NumberControl,
  BooleanControl,
  ColorControl,
} from '@magic-circle/client';

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
  const sceneLayer = gui.layer('Scene');

  let i = 1;
  for (let x = 0; x < 2; x += 1) {
    for (let y = 0; y < 2; y += 1) {
      for (let z = 0; z < 2; z += 1) {
        const geometry = new BoxBufferGeometry(50, 50, 50);
        const material = new MeshBasicMaterial({ color: new Color('#0000ff') });
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);

        mesh.position.x = x * 100;
        mesh.position.y = y * 100;
        mesh.position.z = z * 100;

        const meshLayer = sceneLayer.layer(`Box ${i}`);

        meshLayer.folder('Position', [
          new NumberControl(mesh.position, 'x').range(-200, 200),
          new NumberControl(mesh.position, 'y').range(-200, 200),
          new NumberControl(mesh.position, 'z').range(-200, 200),
        ]);

        meshLayer.folder('Scale', [
          new NumberControl(mesh.scale, 'x').range(-3, 3),
          new NumberControl(mesh.scale, 'y').range(-3, 3),
          new NumberControl(mesh.scale, 'z').range(-3, 3),
        ]);

        meshLayer.folder('Material', [
          new ColorControl(mesh.material, 'color').range(1),
          new NumberControl(mesh.material, 'opacity').range(0, 1),
          new BooleanControl(mesh.material, 'transparent'),
        ]);

        i += 1;
      }
    }
  }

  const animationLayer = gui.layer('Animation');
  animationLayer
    .folder('Rotation')
    .add([
      new NumberControl(animation, 'x').range(-0.1, 0.1).stepSize(0.001),
      new NumberControl(animation, 'y').range(-0.1, 0.1).stepSize(0.001),
    ]);
}

export function loop() {
  scene.rotation.x += animation.x;
  scene.rotation.y += animation.y;
  renderer.render(scene, camera);
}
