import {
  Plugin,
  icons,
  App,
  MainLayerExport,
  LayerExport,
  LayoutHook,
  ControlExport,
} from '@magic-circle/schema';
import type Layers from '@magic-circle/layers';
import { Store, StoreFamily } from '@magic-circle/state';
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
  name: 'New scene',
  values: {},
};

export default class Timeline implements Plugin {
  ipc: App['ipc'];
  client: App;
  layers: Layers;

  scene: Store<Scene>;
  playhead: Store<number>;
  playing: Store<boolean>;
  selected: Store<selection | null>;

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
    this.playhead = new Store<number>(0);
    this.playing = new Store<boolean>(false);
    this.selected = new Store<selection | null>(null);

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
      <TimelineBottom timeline={this} app={this.client} />
    );
  }

  sidebar() {
    return {
      icon: 'Clock' as icons,
      name: 'timeline',
      render: <Sidebar timeline={this} />,
    };
  }

  // async load(data: Record<string, any>) {
  //   Object.keys(data).forEach((key) => this.setControl(key, data[key]));
  // }

  // hydrate() {
  //   const hydrate: Record<string, any> = {};
  //   this.lookup.export((key, value) => {
  //     if ('value' in value && !value.blockHydrate) {
  //       hydrate[key] = value.value;
  //     }
  //   });
  //   return hydrate;
  // }

  // async save() {
  //   const toSave = {};

  //   this.lookup.export((key, value) => {
  //     if (value && 'value' in value && value.value) {
  //       toSave[key] = value.value;
  //     }
  //   });

  //   return toSave;
  // }

  async reset() {
    this.scene.set(emptyScene);
    this.playhead.set(0);
    this.playing.set(false);
  }

  preConnect() {
    this.reset();
  }

  sync() {
    this.ipc.send('timeline:scene', this.scene.value);
  }

  setPlayhead(time: number) {
    this.ipc.send('timeline:playhead', time);
  }

  selectTrack() {
    if (this.client.selectQuery.value) {
      this.client.selectQuery.set(null);
    } else {
      this.client.selectQuery.set({
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

          this.client.selectQuery.set(null);
        },
      });
    }
  }

  addKeyframe(path: string, time: number) {
    const current = this.scene.value.values[path];

    // Start with first frame
    if (!current || current.length === 0) {
      const currentValue = this.layers.lookup.get(path).value;

      if ('value' in currentValue) {
        this.scene.setFn((curr) => ({
          ...curr,
          values: {
            ...curr.values,
            [path]: [
              {
                time,
                value: currentValue.value,
              },
            ],
          },
        }));
      }
    }

    // Check if keyframe already exists
    else if (current && !current.find((c) => c.time === time)) {
      const currentValue = this.layers.lookup.get(path).value;

      if ('value' in currentValue) {
        this.scene.setFn((curr) => ({
          ...curr,
          values: {
            ...curr.values,
            [path]: [
              ...curr.values[path],
              {
                time,
                value: currentValue.value,
              },
            ].sort((a, b) => {
              return a.time - b.time;
            }),
          },
        }));
      }

      // Read current value [todo]
    }

    // todo sync again with fe
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
            console.log({ k, key });
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
              } else {
                return {
                  ...c,
                  controlPoints: {
                    left: [0.75, 1.0],
                    right: [0.25, 0.1],
                  },
                };
              }
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
}
