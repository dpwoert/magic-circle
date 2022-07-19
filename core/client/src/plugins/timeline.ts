import Plugin from '../plugin';
import PluginLayers from './layers';

import bezier from '../utils/bezier';
import { lerp, clamp } from '../utils/math';

type ScenePoint = {
  time: number;
  value: number | boolean;
  controlPoint?: number[];
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
  scene: Scene;
  variables: Record<string, SceneVariable>;
  playhead: number;
  playing: boolean;
  startTime: Date;
  layers: PluginLayers;

  constructor(client: Plugin['client']) {
    super(client);

    this.scene = {
      duration: 10000,
      loop: false,
      name: 'Untitled',
      values: {},
    };
    this.variables = {};
  }

  setup() {
    this.layers = this.client.plugin<PluginLayers>('layers');

    if (!this.layers) {
      throw new Error(
        'Layers plugin not loaded, this is needed for the timeline plugin'
      );
    }

    // Reset playhead
    this.setPlayhead(0);

    // Listen to events
    const { ipc } = this.client;
    ipc.on('timeline:playhead', (_, playhead: number) => {
      this.setPlayhead(playhead);
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
          points[i + 0].controlPoint[0] || 0,
          points[i + 0].controlPoint[1] || 0,

          points[i + 1].controlPoint[0] || 1,
          points[i + 1].controlPoint[1] || 1
        ),
      };

      this.variables[path].curves.push(curve);
    }
  }

  set(scene: Scene) {
    this.scene = scene;

    Object.keys(this.scene.values).forEach((path) => {
      this.setVariable(path, this.scene.values[path]);
    });
  }

  setPlayhead(time: number) {
    this.client.ipc.send('timeline:playhead', time);
    console.log({ time });

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
        const progress = time / current.to.time - time;
        const relative = current.curve(progress);
        const value = lerp(+current.from.value, +current.to.value, relative);

        this.layers.set(variable.path, value);
      }
    });

    //send to ui
    this.client.ipc.send('timeline:playhead', this.playhead);
  }

  play() {
    this.playing = true;
    this.startTime = new Date();

    console.log('timeline play');

    this.client.ipc.send('timeline:play');
  }

  stop() {
    this.playing = false;
    this.startTime = null;

    this.client.ipc.send('timeline:stop');
  }

  startFrame() {
    if (this.playing) {
      const now = Date.now();
      this.setPlayhead(now - this.startTime.valueOf());
    }
  }
}
