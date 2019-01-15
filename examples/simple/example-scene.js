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
  FloatControl,
  BooleanControl,
  TextControl,
  ColorControl,
  ButtonControl,
} from '@creative-controls/client';

let renderer, scene, camera, mesh;

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
  const material = new MeshBasicMaterial({ color: new Color('#ff0000') });
  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const glob = {
    name: 'Test name',
    subtitle: 'Test subtitle',
    subtitle2: 'Subtitle to test 2',
    alert: () => alert(`name: ${glob.name}`),
  };

  // controls
  const layer1 = new Layer('World');
  const layer2 = new Layer('Scene');
  const layer3 = new Layer('Box').addTo(layer1);
  const layer4 = new Layer('Box2').addTo(layer1);

  layer3.folder(
    'Global',
    new TextControl(glob, 'name'),
    new TextControl(glob, 'subtitle'),
    new TextControl(glob, 'subtitle2').values(['test1', 'test2', 'test3']),
    new ButtonControl(glob, 'alert').label('Trigger alert')
  );
  layer3.folder(
    'Position',
    new FloatControl(mesh.position, 'x').range(-100, 100),
    new FloatControl(mesh.position, 'y').range(-100, 100),
    new FloatControl(mesh.position, 'z').range(-100, 100)
  );
  layer3.folder(
    'Scale',
    new FloatControl(mesh.scale, 'x').range(-3, 3),
    new FloatControl(mesh.scale, 'y').range(-3, 3),
    new FloatControl(mesh.scale, 'z').range(-3, 3)
  );
  layer3.folder(
    'Material',
    new ColorControl(mesh.material, 'color').range(1),
    new FloatControl(mesh.material, 'opacity').range(0, 1),
    new BooleanControl(mesh.material, 'transparent')
  );

  gui.addLayer(layer1);
  gui.addLayer(layer2);
}

export function loop() {
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
