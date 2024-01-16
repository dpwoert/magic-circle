import {
  PerspectiveCamera,
  Scene,
  PMREMGenerator,
  WebGLRenderer,
  Color,
  AnimationMixer,
  Vector3,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { MagicCircle } from '@magic-circle/client';
import * as GUI from '@magic-circle/three';
import { COLORS } from '@magic-circle/styles';

export default class Viewer {
  renderer: WebGLRenderer;
  loader: GLTFLoader;
  camera: PerspectiveCamera;
  scene: Scene;
  controls: OrbitControls;

  mixer?: AnimationMixer;
  magicCircle?: MagicCircle;

  constructor() {
    // Create renderer
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = 'canvas';
    this.renderer.domElement.style.display = 'none';

    // create camera
    const ratio = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(40, ratio, 1, 100);
    this.camera.position.set(5, 2, 8);

    // create scene
    const pmremGenerator = new PMREMGenerator(this.renderer);
    this.scene = new Scene();
    this.scene.background = new Color(COLORS.shades.s800.css);
    this.scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(this.renderer),
      0.04
    ).texture;

    // create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();
    this.controls.enablePan = false;
    this.controls.enableDamping = true;

    // create loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.loader = new GLTFLoader();
    this.loader.setCrossOrigin('anonymous');
    this.loader.setDRACOLoader(dracoLoader);

    // event binding
    this.setup = this.setup.bind(this);
    this.tick = this.tick.bind(this);
  }

  setup(gui: MagicCircle) {
    this.magicCircle = gui;

    // Listen to resizes of the window
    window.addEventListener('resize', () => {
      this.resize(window.innerWidth, window.innerHeight);
    });

    return this.renderer.domElement;
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  async view(url: string) {
    // Clear current view
    this.clearView();

    // Load file
    const gltf = await this.loader.loadAsync(url);

    // Add to scene
    const model = gltf.scene;
    this.scene.add(model);

    // Play animation
    this.mixer = new AnimationMixer(model);
    if (gltf.animations && gltf.animations.length > 0) {
      this.mixer.clipAction(gltf.animations[0]).play();
    }

    // Create UI
    // GUI.renderer(this.renderer).addTo(gui.layer);
    GUI.camera(this.camera, {
      range: new Vector3(10, 10, 10),
      scene: this.scene,
    }).addTo(this.magicCircle.layer);
    GUI.scene(this.scene, {
      watch: () => true,
      camera: this.camera,
      onTransformStart: () => {
        this.controls.enabled = false;
      },
      onTransformEnd: () => {
        this.controls.enabled = true;
      },
    }).addTo(this.magicCircle.layer);

    // Trigger sync of UI
    this.magicCircle.sync();

    // Show
    this.renderer.domElement.style.display = 'block';

    URL.revokeObjectURL(url);
  }

  clearView() {
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer = undefined;
    }
    if (this.magicCircle) {
      this.magicCircle.layer.forEach((c) => c.destroy(true));
      this.magicCircle.layer.children = [];
    }
  }

  tick(delta: number) {
    if (this.mixer) this.mixer.update(delta);
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}
