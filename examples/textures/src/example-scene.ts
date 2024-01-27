import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  Mesh,
  WebGLRenderer,
  Color,
  TextureLoader,
  MeshStandardMaterial,
  DirectionalLight,
  AmbientLight,
} from 'three';

import {
  MagicCircle,
  Layer,
  Folder,
  NumberControl,
  ColorControl,
  ButtonControl,
  BooleanControl,
  TextControl,
  ImageControl,
} from '@magic-circle/client';

import diffuse from './assets/texture-diffuse.jpeg';
import bump from './assets/texture-bump.jpeg';
import roughness from './assets/texture-roughness.jpeg';

let renderer;
let scene;
let camera;

const animation = { x: 0.005, y: 0.01 };

export function resize(width: number, height: number) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

export async function setup(gui: MagicCircle) {
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
  const sceneLayer = new Layer('Scene').addTo(gui.layer);

  // Create lights
  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(300, 0, 300);
  scene.add(light);

  const light2 = new DirectionalLight(0xffffff, 1);
  light2.position.set(-300, 300, 0);
  scene.add(light2);

  const ambient = new AmbientLight(0xffffff, 0.2);
  scene.add(ambient);

  const loader = new TextureLoader();

  const [texDiffuse, texBump, texRoughness] = await Promise.all([
    loader.loadAsync(diffuse),
    loader.loadAsync(bump),
    loader.loadAsync(roughness),
  ]);

  let i = 1;
  for (let x = 0; x < 2; x += 1) {
    for (let y = 0; y < 2; y += 1) {
      for (let z = 0; z < 2; z += 1) {
        const geometry = new BoxGeometry(50, 50, 50);
        const material = new MeshStandardMaterial({
          color: new Color('#ffffff'),
          map: texDiffuse,
          bumpMap: texBump,
          roughnessMap: texRoughness,
        });
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);

        mesh.position.x = x * 100;
        mesh.position.y = y * 100;
        mesh.position.z = z * 100;

        const meshLayer = new Layer(`Box ${i}`).addTo(sceneLayer);
        const positionFolder = new Folder('Position').addTo(meshLayer);
        const scaleFolder = new Folder('Scale').addTo(meshLayer);
        const materialFolder = new Folder('Material').addTo(meshLayer);
        const textureFolder = new Folder('Texture').addTo(meshLayer);

        positionFolder.add([
          new NumberControl(mesh.position, 'x').range(-200, 200),
          new NumberControl(mesh.position, 'y').range(-200, 200),
          new NumberControl(mesh.position, 'z').range(-200, 200),
        ]);

        scaleFolder.add([
          new NumberControl(mesh.scale, 'x').range(0, 15),
          new NumberControl(mesh.scale, 'y').range(0, 15),
          new NumberControl(mesh.scale, 'z').range(0, 15),
        ]);

        textureFolder.add([
          new ImageControl(texDiffuse.source.data)
            .label('Diffuse')
            .on('update', () => {
              texDiffuse.needsUpdate = true;
            }),
          new ImageControl(texBump.source.data).label('Bump').onUpdate(() => {
            texBump.needsUpdate = true;
          }),
          new ImageControl(texRoughness.source.data)
            .label('Roughness')
            .on('update', () => {
              texRoughness.needsUpdate = true;
            }),
        ]);

        materialFolder.add([
          new TextControl(material, 'name'),
          new ColorControl(material, 'color').range(1),
          new BooleanControl(material, 'transparent'),
          new NumberControl(material, 'roughness').range(0, 1),
          new NumberControl(material, 'metalness').range(0, 1),
          new NumberControl(material, 'opacity').range(0, 1).stepSize(0.05),
        ]);

        i += 1;
      }
    }
  }

  const animationLayer = new Layer('Animation').addTo(gui.layer);
  const animationFolder = new Folder('Rotation').addTo(animationLayer);

  animationFolder.add([
    new NumberControl(animation, 'x').stepSize(0.001),
    new NumberControl(animation, 'y').stepSize(0.001),
    new ButtonControl(gui, 'stop').label('Stop'),
  ]);

  // Listen to resizes of the window
  window.addEventListener('resize', () => {
    resize(window.innerWidth, window.innerHeight);
  });

  // Save element for screenshots
  return renderer.domElement;
}

export function loop() {
  scene.rotation.x += animation.x;
  scene.rotation.y += animation.y;
  renderer.render(scene, camera);
}
