/*
 * @see https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_keyframes.html
 */

import {
  PerspectiveCamera,
  Scene,
  PMREMGenerator,
  WebGLRenderer,
  Color,
  AnimationMixer,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { MagicCircle } from '@magic-circle/client';
import * as GUI from '@magic-circle/three';

// import gltfFile from './damagedHelmet.glb?url';
import gltfFile from './littlestTokyo.glb?url';

let renderer: WebGLRenderer;
let scene: Scene;
let camera: PerspectiveCamera;
let mixer: AnimationMixer;
let controls: OrbitControls;

export function resize(width: number, height: number) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

export async function setup(gui: MagicCircle) {
  // Create renderer
  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // create camera
  const ratio = window.innerWidth / window.innerHeight;
  camera = new PerspectiveCamera(40, ratio, 1, 100);
  camera.position.set(5, 2, 8);

  // create scene
  const pmremGenerator = new PMREMGenerator(renderer);
  scene = new Scene();
  scene.background = new Color(0xbfe3dd);
  scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(renderer),
    0.04
  ).texture;

  // create controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  // Load file
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  const gltf = await loader.loadAsync(gltfFile);

  // Add to scene
  const model = gltf.scene;
  model.position.set(1, 1, 0);
  model.scale.set(0.01, 0.01, 0.01);
  scene.add(model);

  // Play animation
  mixer = new AnimationMixer(model);
  if (gltf.animations && gltf.animations.length > 0) {
    mixer.clipAction(gltf.animations[0]).play();
  }

  // Create UI
  GUI.recursive(model, {
    watch: () => true,
    camera,
    onTransformStart: () => {
      controls.enabled = false;
    },
    onTransformEnd: () => {
      controls.enabled = true;
    },
  }).traverse((child) => {
    // skip a few root nodes...
    if ('name' in child && child.name === 'RootNode') {
      gui.layer.add(child);
    }
  });

  // Listen to resizes of the window
  window.addEventListener('resize', () => {
    resize(window.innerWidth, window.innerHeight);
  });

  // Save element for screenshots
  return renderer.domElement;
}

export function loop(delta: number) {
  mixer.update(delta);
  controls.update();

  renderer.render(scene, camera);
}
