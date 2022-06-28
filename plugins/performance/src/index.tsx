import { Plugin, icons, App } from '@magic-circle/schema';
import { Store } from '@magic-circle/state';
import { registerIcon, TrendingUp } from '@magic-circle/styles';
import Sidebar from './Sidebar';

registerIcon(TrendingUp);

type loadTimes = {
  firstPaint?: number;
  firstContentfulPaint?: number;
  loadingTime?: number;
};

type fps = {
  fps?: number;
  memory?: number;
  renderTime?: number;
};

const MAX_TICKS = 75;

const updateTick = (store: number[], value: number) => {
  const newStore = [...store, value];

  if (newStore.length > MAX_TICKS) {
    newStore.shift();
  }

  return newStore;
};

export default class Performance implements Plugin {
  ipc: App['ipc'];
  client: App;

  name = 'performance';

  fps: Store<number[]>;
  renderTime: Store<number[]>;
  memory: Store<number>;
  loadTimes: Store<loadTimes>;

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;

    this.loadTimes = new Store<loadTimes>({});
    this.fps = new Store<number[]>([]);
    this.memory = new Store<number>(0);
    this.renderTime = new Store<number[]>([]);

    this.ipc.on('performance:loading', (_, metrics: loadTimes) => {
      this.loadTimes.set(metrics);
    });
    this.ipc.on('performance:fps', (_, metrics: fps) => {
      this.fps.set(updateTick(this.fps.value, metrics.fps));
      this.renderTime.set(
        updateTick(this.renderTime.value, metrics.renderTime)
      );
      this.memory.set(metrics.memory);
    });
  }

  sidebar() {
    return {
      icon: 'TrendingUp' as icons,
      name: 'performance',
      render: <Sidebar performance={this} />,
    };
  }

  async save() {
    return {
      fps: {
        average:
          this.fps.value.reduce((a, b) => a + b, 0) / this.fps.value.length,
        last: this.fps.value[this.fps.value.length - 1],
      },
      renderTime: {
        average:
          this.renderTime.value.reduce((a, b) => a + b, 0) /
          this.renderTime.value.length,
        last: this.renderTime.value[this.renderTime.value.length - 1],
      },
      ...(this.loadTimes.value || []),
    };
  }
}
