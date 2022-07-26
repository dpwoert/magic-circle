/* eslint-disable no-alert */
import { get, set } from 'idb-keyval';
import { saveAs } from 'file-saver';

import { Plugin, icons, App, LayoutHook } from '@magic-circle/schema';
import type Layers from '@magic-circle/layers';
import { Store } from '@magic-circle/state';
import {
  registerIcon,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  PlusCircle,
  Trash,
  Eye,
  Ease,
  Linear,
  ZoomIn,
  ZoomOut,
  Edit,
  DotsVertical,
  Tag,
  Copy,
  Share,
  FloppyDisc,
  Spinner,
  Download,
  FilePlus,
} from '@magic-circle/styles';

import Sidebar from './Sidebar';
import TimelineBottom from './Timeline';
import { clamp } from './utils';

registerIcon(ChevronUp);
registerIcon(ChevronDown);
registerIcon(Clock);
registerIcon(Plus);
registerIcon(PlusCircle);
registerIcon(Trash);
registerIcon(Eye);
registerIcon(Ease);
registerIcon(Linear);
registerIcon(ZoomIn);
registerIcon(ZoomOut);
registerIcon(Edit);
registerIcon(DotsVertical);
registerIcon(Tag);
registerIcon(Copy);
registerIcon(Share);
registerIcon(FloppyDisc);
registerIcon(Spinner);
registerIcon(Download);
registerIcon(FilePlus);

export type ScenePoint = {
  time: number;
  value: number | boolean;
  controlPoints?: {
    left: number[];
    right: number[];
  };
};

export type Scene = {
  duration: number;
  loop: boolean;
  seamlessLoop: boolean;
  name: string;
  values: Record<string, ScenePoint[]>;
};

type selection = {
  key: number;
  path: string;
};

const emptyScene: Scene = {
  duration: 1000 * 10,
  loop: false,
  seamlessLoop: false,
  name: 'New scene',
  values: {},
};

type Data = {
  scene: Scene;
  playhead: number;
};

export default class Timeline implements Plugin {
  ipc: App['ipc'];
  client: App;
  layers: Layers;

  scene: Store<Scene>;
  scenes: Store<Record<string, Scene>>;
  activeScene: Store<string | null>;
  playhead: Store<number>;
  playing: Store<boolean>;
  zoom: Store<number>;
  selected: Store<selection | null>;
  show: Store<boolean>;

  name = 'timeline';

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;
    this.layers = this.client.getPlugin('layers') as Layers;

    if (!this.layers) {
      throw new Error('Layers plugin is needed when using the timeline plugin');
    }

    // Create stores
    this.scene = new Store<Scene>(emptyScene);
    this.scenes = new Store<Record<string, Scene>>({});
    this.activeScene = new Store(null);
    this.playhead = new Store<number>(0);
    this.playing = new Store<boolean>(false);
    this.zoom = new Store<number>(0.1);
    this.selected = new Store<selection | null>(null);
    this.show = new Store<boolean>(false);

    this.ipc.on('timeline:play', () => {
      this.playing.set(true);
    });
    this.ipc.on('timeline:stop', () => {
      this.playing.set(false);
    });
    this.ipc.on('timeline:playhead', (_, playhead) => {
      this.playhead.set(playhead);
    });
    this.ipc.on('timeline:scene', (_, scene) => {
      this.scene.set(scene);
    });

    // Set controls sidebar
    this.client.setLayoutHook(
      LayoutHook.BOTTOM,
      <TimelineBottom timeline={this} />
    );
  }

  sidebar() {
    return {
      icon: 'Clock' as icons,
      name: 'timeline',
      render: <Sidebar timeline={this} />,
    };
  }

  async load(data: Data) {
    this.scene.set(data.scene);
    this.playhead.set(data.playhead);
  }

  // hydrate() {
  //   return {
  //     playhead: this.playhead.value,
  //     scene: this.scene.value,
  //   };
  // }

  async save(): Promise<Data> {
    return {
      playhead: this.playhead.value,
      scene: this.scene.value,
    };
  }

  async reset() {
    this.scene.set(emptyScene);
    this.playhead.set(0);
    this.playing.set(false);
    this.activeScene.set(null);

    const scenes = await get<Record<string, Scene>>('scenes');
    this.scenes.set(scenes || {});
  }

  preConnect() {
    this.reset();
  }

  sync() {
    this.ipc.send('timeline:scene', this.scene.value);

    this.layers.external.setFn((curr) => ({
      ...curr,
      [this.name]: Object.keys(this.scene.value.values),
    }));
  }

  play() {
    this.ipc.send('timeline:play');
  }

  stop() {
    this.ipc.send('timeline:stop');
  }

  setPlayhead(time: number) {
    this.ipc.send('timeline:playhead', time);
  }

  selectTrack() {
    if (this.layers.setExternal.value) {
      this.layers.setExternal.set(null);
    } else {
      this.layers.setExternal.set({
        label: 'Add track',
        icon: 'Clock',
        filter: 'timeline',
        onSelect: (path) => {
          this.scene.set({
            ...this.scene.value,
            values: {
              ...this.scene.value.values,
              [path]: [],
            },
          });

          this.layers.setExternal.set(null);
        },
      });
    }
  }

  async addKeyframe(path: string, time: number) {
    const current = this.scene.value.values[path];

    // Start with first frame
    if (!current || current.length === 0) {
      // Ask the client to interpolate the current value
      const interpolated = await this.ipc.invoke<number>(
        'timeline:get-value',
        path,
        time
      );

      if (interpolated) {
        this.scene.setFn((curr) => ({
          ...curr,
          values: {
            ...curr.values,
            [path]: [
              {
                time,
                value: interpolated,
                // value: currentValue.value,
              },
            ],
          },
        }));
      }
    }

    // Check if keyframe already exists (if so, we can't add a second one)
    else if (current && !current.find((c) => c.time === time)) {
      // Ask the client to interpolate the current value
      const interpolated = await this.ipc.invoke<number>(
        'timeline:get-value',
        path,
        time
      );

      if (interpolated) {
        this.scene.setFn((curr) => ({
          ...curr,
          values: {
            ...curr.values,
            [path]: [
              ...curr.values[path],
              {
                time,
                value: interpolated,
              },
            ].sort((a, b) => {
              return a.time - b.time;
            }),
          },
        }));
      }
    }

    this.sync();
  }

  removeKeyframe(path: string, key: number) {
    const current = this.scene.value.values[path];

    if (current) {
      this.scene.setFn((curr) => ({
        ...curr,
        values: {
          ...curr.values,
          [path]: current.filter((c, k) => k !== key),
        },
      }));
    }

    this.sync();
  }

  changeKeyframe(path: string, key: number, newTime: number, newValue: any) {
    const current = this.scene.value.values[path];

    if (current) {
      this.scene.setFn((curr) => ({
        ...curr,
        values: {
          ...curr.values,
          [path]: current.map((c, k) => {
            let left = 0;
            let right = this.scene.value.duration;

            // ensure we're not moving this keyframe before/after others
            if (k > 0) {
              left = current[k - 1].time + 1;
            }
            if (k < current.length - 1) {
              right = current[k + 1].time - 1;
            }

            if (key === k) {
              return {
                ...c,
                time: clamp(newTime, left, right),
                value: newValue,
              };
            }

            return c;
          }),
        },
      }));
    }

    this.sync();
  }

  changeHandleForKeyframe(
    path: string,
    key: number,
    direction: 'left' | 'right',
    newX: number,
    newY: number
  ) {
    const current = this.scene.value.values[path];

    if (current) {
      this.scene.setFn((curr) => ({
        ...curr,
        values: {
          ...curr.values,
          [path]: current.map((c, k) => {
            if (key === k) {
              return {
                ...c,
                controlPoints: {
                  ...c.controlPoints,
                  [direction]: [newX, newY],
                },
              };
            }
            return c;
          }),
        },
      }));
    }

    this.sync();
  }

  toggleEaseForKeyframe(path: string, key: number) {
    const current = this.scene.value.values[path];

    if (current) {
      this.scene.setFn((curr) => ({
        ...curr,
        values: {
          ...curr.values,
          [path]: current.map((c, k) => {
            if (key === k) {
              if (c.controlPoints) {
                return {
                  ...c,
                  controlPoints: null,
                };
              }

              return {
                ...c,
                controlPoints: {
                  left: [0.75, 1.0],
                  right: [0.25, 0.1],
                },
              };
            }

            return c;
          }),
        },
      }));
    }

    this.sync();
  }

  getKeyframeByKey(path: string, key: number) {
    const current = this.scene.value.values[path];
    return current[key];
  }

  changeDuration(duration: number) {
    this.scene.setFn((curr) => ({
      ...curr,
      duration,
    }));
    this.sync();
  }

  toggleLoop() {
    this.scene.setFn((curr) => ({
      ...curr,
      loop: !curr.loop,
    }));
    this.sync();
  }

  toggleSeamlessLoop() {
    this.scene.setFn((curr) => ({
      ...curr,
      seamlessLoop: !curr.seamlessLoop,
    }));
    this.sync();
  }

  async editScene(key: string) {
    if (this.scenes.value[key]) {
      this.activeScene.set(key);
      this.scene.set(this.scenes.value[key]);
    }
  }

  async saveScene(key: string, value: Scene) {
    this.scenes.setFn((curr) => ({
      ...curr,
      [key]: value,
    }));
    await set('scenes', this.scenes.value);
  }

  async saveCurrentScene() {
    const key = this.activeScene.value || String(Date.now());
    this.activeScene.set(key);

    if (
      !this.activeScene.value &&
      !window.confirm('Are you sure you want to save a new scene?')
    ) {
      return;
    }

    await this.saveScene(key, this.scene.value);
  }

  async createNewScene() {
    return this.saveScene(String(Date.now()), { ...emptyScene });
  }

  async duplicateScene(sceneId: string) {
    if (this.scenes.value[sceneId]) {
      await this.saveScene(String(Date.now()), this.scenes.value[sceneId]);
    }
  }

  async renameScene(sceneId: string, newName: string) {
    return this.saveScene(sceneId, {
      ...this.scenes.value[sceneId],
      name: newName,
    });
  }

  async deleteScene(sceneId: string) {
    if (window.confirm('Are you sure you want to delete this scene?')) {
      this.scenes.setFn((curr) => {
        const newList = { ...curr };
        delete newList[sceneId];
        return newList;
      });
      await set('scenes', this.scenes.value);
    }
  }

  exportScene(sceneId: string) {
    if (this.scenes.value[sceneId]) {
      const blob = new Blob(
        [JSON.stringify(this.scenes.value[sceneId], null, 2)],
        {
          type: 'text/plain;charset=utf-8',
        }
      );
      saveAs(blob, `${this.scenes.value[sceneId].name}.json`);
    }
  }
}
