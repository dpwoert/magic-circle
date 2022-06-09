import { atom, RecoilState, RecoilRoot } from 'recoil';

import type {
  Plugin,
  icons,
  App,
  MainLayerExport,
  Store,
} from '@magic-circle/schema';

import Sidebar from './Sidebar';

export default class Layers implements Plugin {
  ipc: App['ipc'];
  client: App;
  store: Store<MainLayerExport>;
  recoil: RecoilState<MainLayerExport>;

  name = 'Layers';

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;
    this.store = client.createStore<MainLayerExport>({
      controls: {},
      layers: [],
    });

    this.recoil = atom<MainLayerExport>({
      key: 'layers',
      default: this.store.value,
      effects: [this.store.effect()],
    });

    this.ipc.on('layers', (layers: MainLayerExport) => {
      console.log('layers received', layers);
      this.store.set(layers);
    });
  }

  sidebar() {
    return {
      icon: 'Rows' as icons,
      render: (
        <RecoilRoot>
          <Sidebar layers={this} />
        </RecoilRoot>
      ),
    };
  }
}
