import Plugin from '../plugin';
import PluginLayers from './layers';

import bezier from '../utils/bezier';
import { clamp } from '../utils/math';

type ScenePoint = {
  time: number;
  value: unknown;
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
  seamlessLoop: boolean;
  name: string;
  values: Record<string, ScenePoint[]>;
};

export type SceneVariable = {
  path: string;
  curves: SceneCurve[];
};

type Hydration = {
  scene: Scene;
  playhead: number;
};

export default class PluginTimeline extends Plugin {
  static id = 'timeline';

  private layers?: PluginLayers;
  private scene?: Scene;
  private start?: {
    scene: Scene;
    play: boolean;
  };
  private variables: Record<string, SceneVariable> = {};
  playhead: number = 0;
  playing: boolean = false;

  setup() {
    this.layers = this.client.plugin(PluginLayers) || undefined;

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
        seamlessLoop: false,
        values: {},
      });
    }
  }

  connect() {
    // Listen to events
    const { ipc } = this.client;

    if (ipc) {
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
      ipc.on('timeline:get-value', (_, path: string, time: number) => {
        ipc.send('timeline:get-value', this.getValueForVariable(path, time));
      });
      ipc.on('timeline:play', () => {
        this.play();
      });
      ipc.on('timeline:stop', () => {
        this.stop();
      });
    }
  }

  hydrate(data: Hydration) {
    if (data.scene) {
      this.set(data.scene);
      this.setPlayhead(data.playhead || 0);
    }
  }

  setVariable(path: string, points: ScenePoint[]) {
    this.variables[path] = {
      path,
      curves: [],
    };

    if (!this.scene) {
      return;
    }

    const allPoints: ScenePoint[] = [
      {
        ...points[0],
        time: 0,
      },
      ...points,
      {
        ...points[this.scene.seamlessLoop ? 0 : points.length - 1],
        time: this.scene.duration + 1,
      },
    ];

    for (let i = 0; i < allPoints.length - 1; i += 1) {
      const curve = {
        from: allPoints[i + 0],
        to: allPoints[i + 1],
        curve: bezier(
          allPoints[i + 0]?.controlPoints?.right[0] || 0,
          allPoints[i + 0]?.controlPoints?.right[1] || 0,

          allPoints[i + 1]?.controlPoints?.left[0] || 1,
          allPoints[i + 1]?.controlPoints?.left[1] || 1
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
      this.setVariable(path, scene.values[path]);
    });

    if (this.client.ipc) {
      this.client.ipc.send('timeline:scene', scene);
    }
  }

  private getValueForVariable(variableName: string, time: number) {
    if (!this.layers) return null;

    const variable = this.variables[variableName];
    const control = this.layers.get(variableName);

    if (variable && control) {
      const current = variable.curves.find(
        (curve) =>
          this.playhead >= curve.from.time && this.playhead < curve.to.time
      );

      if (current) {
        const progress =
          (time - current.from.time) / (current.to.time - current.from.time);
        const relative = current.curve(progress);

        if ('interpolate' in control) {
          return control.interpolate(
            current.from.value,
            current.to.value,
            relative
          );
        }
      }
    }

    return null;
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
      const value = this.getValueForVariable(variable.path, time);
      this.layers?.set(variable.path, value);

      if (this.client.ipc) {
        this.client.ipc.send('control:set-value', variable.path, value);
      }
    });

    // Send to UI
    if (this.client.ipc) {
      this.client.ipc.send('timeline:playhead', this.playhead);
    }

    // End of timeline
    if (time >= this.scene.duration && this.playing) {
      this.setPlayhead(0);

      if (!this.scene.loop) {
        this.stop();
      }
    }
  }

  play() {
    this.playing = true;

    if (this.client.ipc) {
      this.client.ipc.send('timeline:play');
    }
  }

  stop() {
    this.playing = false;

    if (this.client.ipc) {
      this.client.ipc.send('timeline:stop');
    }
  }

  startFrame(delta: number) {
    if (this.playing) {
      this.setPlayhead(this.playhead + delta * 1000);
    }
  }
}
