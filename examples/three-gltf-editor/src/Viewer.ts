import {
  PerspectiveCamera,
  Scene,
  PMREMGenerator,
  WebGLRenderer,
  Color,
  AnimationMixer,
  Mesh,
  Object3D,
  LoadingManager,
  DirectionalLight,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  SpotLight,
  PointLight,
  HemisphereLight,
  AmbientLight,
  BoxGeometry,
} from 'three';

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { MagicCircle } from '@magic-circle/client';
import * as GUI from '@magic-circle/three';
import { COLORS } from '@magic-circle/styles';

import { saveArrayBuffer, saveString } from './utils';

const dispose = (object: Object3D) => {
  if ('geometry' in object) {
    (object.geometry as Mesh['geometry']).dispose();
  }

  if ('material' in object) {
    const mat = object.material as Mesh['material'];
    const materials = Array.isArray(mat) ? mat : [mat];
    materials.forEach((material) => {
      // eslint-disable-next-line
      for (const key in material) {
        if (key !== 'envMap' && material[key] && material[key].isTexture) {
          material[key].dispose();
        }
      }

      material.dispose();
    });
  }
};

export default class Viewer {
  renderer: WebGLRenderer;
  loader: GLTFLoader;
  camera: PerspectiveCamera;
  scene: Scene;
  controls: OrbitControls;

  mixer?: AnimationMixer;
  magicCircle?: MagicCircle;
  currentlyVisible?: Object3D;

  private manager: LoadingManager;
  private blobURLs = new Set<string>();
  private currentTransformMode?: 'scale' | 'rotate' | 'translate';

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
    // this.controls.enableDamping = true;

    // create loader
    this.manager = new LoadingManager();
    const dracoLoader = new DRACOLoader(this.manager);
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.loader = new GLTFLoader(this.manager);
    this.loader.setCrossOrigin('anonymous');
    this.loader.setDRACOLoader(dracoLoader);

    // event binding
    this.setup = this.setup.bind(this);
    this.tick = this.tick.bind(this);
  }

  setup(gui: MagicCircle) {
    this.magicCircle = gui;

    // Listen to signals from editor
    if (gui.ipc) {
      gui.ipc.on('gltf:download', (_, binary) => this.exportScene(binary));
      gui.ipc.on('add:light', (_, light: string) => this.addLight(light));
      gui.ipc.on('add:mesh', (_, mesh: string) => this.addMesh(mesh));
      gui.ipc.on('add:group', () => this.addGroup());
      gui.ipc.on(
        'gltf:transform',
        (_, mode: 'scale' | 'rotate' | 'translate') => this.setTransform(mode)
      );
    }

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

  async view(file: File, urls: Map<string, File>) {
    // Clear current view
    this.clearView();

    // @ts-expect-error
    const path = file.path || '';
    const rootPath = `${path.substring(0, path.lastIndexOf('/'))}/`;

    // Intercept and override relative URLs.
    /* @see https://github.com/donmccurdy/three-gltf-viewer/blob/main/src/viewer.js */
    this.manager.setURLModifier((url: string) => {
      const urlParsed = new URL(url);
      const baseURL = `${urlParsed.protocol}${urlParsed.origin}`;

      // URIs in a glTF file may be escaped, or not. Assume that assetMap is
      // from an un-escaped source, and decode all URIs before lookups.
      // See: https://github.com/donmccurdy/three-gltf-viewer/issues/146
      const normalizedURL =
        rootPath +
        decodeURI(url)
          .replace(baseURL, '')
          .replace(/^(\.?\/)/, '');

      if (urls.has(normalizedURL)) {
        const blob = urls.get(normalizedURL);
        const blobURL = URL.createObjectURL(blob);
        this.blobURLs.add(blobURL);
        return blobURL;
      }

      return url;
    });

    // Load file
    const urlObject = URL.createObjectURL(file);
    this.blobURLs.add(urlObject);
    const gltf = await this.loader.loadAsync(urlObject);

    // Add to scene
    const model = gltf.scene;
    this.scene.add(model);

    // Create GUI
    this.syncGUI();

    // Play animation
    this.mixer = new AnimationMixer(model);
    if (gltf.animations && gltf.animations.length > 0) {
      this.mixer.clipAction(gltf.animations[0]).play();
    }

    // Show
    this.renderer.domElement.style.display = 'block';
  }

  addGUI() {
    // Create UI
    this.magicCircle.layer.add(
      GUI.setup(this.renderer, this.camera, this.scene, {
        watch: () => true,
        camera: this.camera,
        onTransformStart: () => {
          this.controls.enabled = false;
        },
        onTransformEnd: () => {
          this.controls.enabled = true;
        },
        onSelectLayer: (object) => {
          this.currentlyVisible = object;
        },
        canDelete: true,
        onDelete: () => this.syncGUI(),
        onRename: () => this.syncGUI(),
        canAddRemoveTextures: true,
        onAddRemoveTexture: () => this.syncGUI(),
        canChangeMaterial: true,
        onChangeMaterial: () => this.syncGUI(),
      })
    );

    // Trigger sync of UI
    this.magicCircle.sync();
  }

  clearGUI() {
    if (this.magicCircle) {
      this.magicCircle.layer.forEach((c) => c.destroy(true));
      this.magicCircle.layer.children = [];
    }
  }

  syncGUI() {
    this.clearGUI();
    this.addGUI();
    this.setTransform(this.currentTransformMode);
  }

  clearView() {
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer = undefined;
    }
    this.clearGUI();

    // Clear blob urls
    this.blobURLs.forEach((url) => URL.revokeObjectURL(url));
    this.blobURLs.clear();

    this.scene.traverse((child) => {
      dispose(child);
    });

    this.scene.children.forEach((child) => {
      child.removeFromParent();
    });
  }

  exportScene(binary = true) {
    const gltfExporter = new GLTFExporter();
    gltfExporter.parse(
      this.scene,
      (result) => {
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, 'scene.glb');
        } else {
          const output = JSON.stringify(result, null, 2);
          saveString(output, 'scene.gltf');
        }
      },
      (error) => {
        console.error('An error happened during parsing', error);
      },
      {
        onlyVisible: false,
        binary,
      }
    );
  }

  addLight(type: string) {
    if (type === 'directional') {
      const light = new DirectionalLight();
      this.scene.add(light);
    } else if (type === 'point') {
      const light = new PointLight();
      this.scene.add(light);
    } else if (type === 'spot') {
      const light = new SpotLight();
      this.scene.add(light);
    } else if (type === 'hemisphere') {
      const light = new HemisphereLight();
      this.scene.add(light);
    } else if (type === 'ambient') {
      const light = new AmbientLight();
      this.scene.add(light);
    }

    this.syncGUI();
  }

  addMesh(type: string) {
    if (this.currentlyVisible) {
      // ensure we're not adding a mesh to mesh...
      const toAddTo =
        this.currentlyVisible instanceof Mesh
          ? this.currentlyVisible.parent
          : this.currentlyVisible;

      if (type === 'plane') {
        const cube = new Mesh(
          new PlaneGeometry(),
          new MeshStandardMaterial({ color: 0xffffff })
        );
        toAddTo.add(cube);
      }
      if (type === 'cube') {
        const cube = new Mesh(
          new BoxGeometry(),
          new MeshStandardMaterial({ color: 0xffffff })
        );
        toAddTo.add(cube);
      }
      if (type === 'sphere') {
        const cube = new Mesh(
          new SphereGeometry(),
          new MeshStandardMaterial({ color: 0xffffff })
        );
        toAddTo.add(cube);
      }
    }

    this.syncGUI();
  }

  addGroup() {
    if (this.currentlyVisible) {
      if (this.currentlyVisible instanceof Mesh) {
        // wrap mesh in group
        const { parent } = this.currentlyVisible;
        const newGroup = new Object3D();
        parent.add(newGroup);
        this.currentlyVisible.removeFromParent();
        newGroup.add(this.currentlyVisible);
      } else {
        this.currentlyVisible.add(new Object3D());
      }
    }

    this.syncGUI();
  }

  setTransform(mode?: 'scale' | 'rotate' | 'translate') {
    this.currentTransformMode = mode;

    if (this.magicCircle) {
      this.magicCircle.layer.traverse((child) => {
        if ('value' in child && child.type === 'boolean' && 'mode' in child) {
          const transformControl = child as GUI.TransformControl;

          if (mode) {
            transformControl.mode(mode);
            transformControl.value = transformControl.isVisible;
          } else if (!mode && transformControl.value) {
            transformControl.value = false;
          }

          transformControl.setAutoEnable(!!mode);
        }
      });
    }
  }

  tick(delta: number) {
    if (this.mixer) this.mixer.update(delta);
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}
