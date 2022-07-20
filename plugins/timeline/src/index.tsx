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
} from '@magic-circle/styles';

import Sidebar from './Sidebar';
import TimelineBottom from './Timeline';

registerIcon(ChevronUp);
registerIcon(ChevronDown);
registerIcon(Clock);
registerIcon(Plus);
registerIcon(PlusCircle);
registerIcon(Trash);
registerIcon(Eye);

export type ScenePoint = {
  time: number;
  value: number | boolean;
  controlPoint?: number[];
};

export type Scene = {
  duration: number;
  loop: boolean;
  name: string;
  values: Record<string, ScenePoint[]>;
};

type selection = {
  time: number;
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

  selectTrack() {
    if (this.client.selectQuery.value) {
      this.client.selectQuery.set(null);
    } else {
      this.client.selectQuery.set({
        label: 'Add track',
        icon: 'Clock',
        filter: 'timeline',
        onSelect: (path) => {
          console.log({ onSelect: path });

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

    console.log({ path, time });

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
      // Add a keyframe
      // Read current value
    }

    // todo sync again with fe
  }

  removeKeyframe(path: string, time: number) {
    const current = this.scene.value.values[path];

    if (current) {
      this.scene.setFn((curr) => ({
        ...curr,
        values: {
          ...curr.values,
          [path]: current.filter((c) => c.time !== time),
        },
      }));
    }

    // sync again
  }
}
