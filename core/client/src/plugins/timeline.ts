import Plugin from '../plugin';
import type PluginLayers from './layers';

import bezier from '../utils/bezier';
import { lerp, clamp } from '../utils/math';

type ScenePoint = {
  time: number;
  value: number | boolean;
  controlPoints?: {
    left: number[];
    right: number[];
  };
};

type SceneCurve = {
  from: ScenePoint;
  to: ScenePoint;
  curve: ReturnType<typeof bezier>;
};

export type Scene = {
  duration: number;
  loop: boolean;
  name: string;
  values: Record<string, ScenePoint[]>;
};

export type SceneVariable = {
  path: string;
  curves: SceneCurve[];
};

export default class PLuginTimeline extends Plugin {
  private layers: PluginLayers;
  private scene: Scene;
  private start?: {
    scene: Scene;
    play: boolean;
  };
  private variables: Record<string, SceneVariable>;
  private startTime: Date;
  playhead: number;
  playing: boolean;

  name = 'timeline';

  setup() {
    this.layers = this.client.plugin<PluginLayers>('layers');

    if (!this.layers) {
      throw new Error(
        'Layers plugin not loaded, this is needed for the timeline plugin'
      );
    }

    // Reset playhead
    this.setPlayhead(0);

    // Set default scene if needed
    if (this.start) {
      if (!this.client.ipc) {
        this.layers.sync();
      }

      this.set(this.start.scene);

      // autoplay if needed
      if (this.start.play) {
        this.play();
      }
    } else {
      this.set({
        duration: 1000 * 10,
        loop: false,
        name: 'New scene',
        values: {},
      });
    }
  }

  connect() {
    // Listen to events
    const { ipc } = this.client;
    ipc.on('timeline:playhead', (_, playhead: number) => {
      this.setPlayhead(playhead);
      this.stop();
    });
    ipc.on('timeline:scene', (_, scene: Scene) => {
      this.set(scene);
    });
    ipc.on('timeline:variable', (_, path: string, points: ScenePoint[]) => {
      this.setVariable(path, points);
    });
    ipc.on('timeline:play', () => {
      this.play();
    });
    ipc.on('timeline:stop', () => {
      this.stop();
    });
  }

  setVariable(path: string, points: ScenePoint[]) {
    this.variables[path] = {
      path,
      curves: [],
    };

    for (let i = 0; i < points.length - 1; i += 1) {
      const curve = {
        from: points[i + 0],
        to: points[i + 1],
        curve: bezier(
          points[i + 0]?.controlPoints?.right[0] || 0,
          points[i + 0]?.controlPoints?.right[1] || 0,

          points[i + 1]?.controlPoints?.left[0] || 1,
          points[i + 1]?.controlPoints?.left[1] || 1
        ),
      };

      this.variables[path].curves.push(curve);
    }
  }

  load(scene: Scene, autoPlay = true) {
    this.start = {
      scene,
      play: autoPlay,
    };
  }

  set(scene: Scene) {
    this.scene = scene;
    this.variables = {};

    Object.keys(this.scene.values).forEach((path) => {
      this.setVariable(path, this.scene.values[path]);
    });

    if (this.client.ipc) {
      this.client.ipc.send('timeline:scene', scene);
    }
  }

  setPlayhead(time: number) {
    if (this.client.ipc) {
      this.client.ipc.send('timeline:playhead', time);
    }

    if (!this.scene || !this.variables) {
      this.playhead = 0;
      return;
    }

    // Set playhead
    this.playhead = clamp(time, 0, this.scene.duration);

    // Set variables with new values
    Object.values(this.variables).forEach((variable) => {
      const current = variable.curves.find(
        (curve) =>
          this.playhead >= curve.from.time && this.playhead < curve.to.time
      );

      if (current) {
        const progress =
          (time - current.from.time) / (current.to.time - current.from.time);
        const relative = current.curve(progress);
        const value = lerp(+current.from.value, +current.to.value, relative);

        this.layers.set(variable.path, value);

        if (this.client.ipc) {
          this.client.ipc.send('control:set-value', variable.path, value);
        }
      }
    });

    // Send to UI
    if (this.client.ipc) {
      this.client.ipc.send('timeline:playhead', this.playhead);
    }

    // End of timeline
    if (time >= this.scene.duration && this.playing) {
      this.setPlayhead(0);
      this.startTime = new Date();

      if (!this.scene.loop) {
        this.stop();
      }
    }
  }

  play() {
    this.playing = true;
    this.startTime = new Date(Date.now() - this.playhead);

    if (this.client.ipc) {
      this.client.ipc.send('timeline:play');
    }
  }

  stop() {
    this.playing = false;
    this.startTime = null;

    if (this.client.ipc) {
      this.client.ipc.send('timeline:stop');
    }
  }

  startFrame() {
    if (this.playing) {
      const now = Date.now();
      this.setPlayhead(now - this.startTime.valueOf());
    }
  }
}
