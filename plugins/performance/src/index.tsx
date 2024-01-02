import { Plugin, icons } from '@magic-circle/schema';
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

export default class Performance extends Plugin {
  name = 'performance';

  loadTimes = new Store<loadTimes>({});
  fps = new Store<number[]>([]);
  memory = new Store<number>(0);
  renderTime = new Store<number[]>([]);

  async setup() {
    this.ipc.on('performance:loading', (_, metrics: loadTimes) => {
      this.loadTimes.set(metrics);
    });
    this.ipc.on('performance:fps', (_, metrics: fps) => {
      this.fps.set(updateTick(this.fps.value, metrics.fps || 0));
      this.renderTime.set(
        updateTick(this.renderTime.value, metrics.renderTime || 0)
      );
      this.memory.set(metrics.memory || 0);
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

  async reset() {
    this.loadTimes.set({});
    this.fps.set([]);
    this.memory.set(0);
    this.renderTime.set([]);
  }
}
