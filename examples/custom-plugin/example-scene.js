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
  Layer,
  NumberControl,
  BooleanControl,
  TextControl,
  ColorControl,
  ButtonControl,
} from '@magic-circle/client';

let renderer;
let scene;
let camera;
let mesh;

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
  const geometry = new BoxBufferGeometry(200, 200, 200);
  const material = new MeshBasicMaterial({ color: new Color('#0000ff') });
  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const glob = {
    name: 'Test name',
    subtitle: 'Test subtitle',
    subtitle2: 'Subtitle to test 2',
    number: '2000',
    alert: () => alert(`name: ${glob.name}`), //eslint-disable-line
  };

  // controls
  const layer1 = gui.layer('World');
  const layer2 = gui.layer('Scene');
  const layer3 = layer1.layer('Box');
  const layer4 = layer1.layer('Box2');

  layer3.folder('Global', [
    new TextControl(glob, 'name'),
    new TextControl(glob, 'subtitle'),
    new TextControl(glob, 'subtitle2').values(['test1', 'test2', 'test3']),
    new NumberControl(glob, 'number'),
    new ButtonControl(glob, 'alert').label('Trigger alert'),
  ]);

  layer3.folder('Position', [
    new NumberControl(mesh.position, 'x').range(-100, 100),
    new NumberControl(mesh.position, 'y').range(-100, 100),
    new NumberControl(mesh.position, 'z').range(-100, 100),
  ]);

  layer3.folder('Scale', [
    new NumberControl(mesh.scale, 'x').range(-3, 3),
    new NumberControl(mesh.scale, 'y').range(-3, 3),
    new NumberControl(mesh.scale, 'z').range(-3, 3),
  ]);

  layer3
    .folder('Material')
    .add([
      new ColorControl(mesh.material, 'color').range(1),
      new NumberControl(mesh.material, 'opacity').range(0, 1),
      new BooleanControl(mesh.material, 'transparent'),
    ]);
}

export function loop() {
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
