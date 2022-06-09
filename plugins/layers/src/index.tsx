import type {
  Plugin,
  icons,
  App,
  MainLayerExport,
  LayerExport,
} from '@magic-circle/schema';
import { Store } from '@magic-circle/state';

import SidebarLeft from './SidebarLeft';

type FlatListItem = LayerExport & {
  depth: number;
  hasChildren: boolean;
};

const convert = (main: MainLayerExport) => {
  const flat: FlatListItem[] = [];
  const lookup :Record<string, LayerExport['children']> = {};

  const recursive = (layers: LayerExport['children'] = [], depth = 0) => {
    layers.forEach(child => {
      if ('folder' in child && !child.folder) {
        flat.push({
          ...child,
          depth,
          hasChildren: child.children && child.children.length > 0,
        });

        if (child.children) {
          recursive(child.children, depth + 1);
        }
      }
    });
  };

  recursive(main.layers);

  return {flat, lookup}
};

export default class Layers implements Plugin {
  ipc: App['ipc'];
  client: App;

  layers: Store<MainLayerExport>;
  flat: Store<FlatListItem[]>;
  lookup: Store<Record<string, LayerExport['children']>>;
  selected: Store<string>;

  name = 'Layers';

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;

    // Create stores
    this.layers = new Store<MainLayerExport>({
      controls: {},
      layers: [],
    });
    this.flat = new Store<FlatListItem[]>([]);
    this.selected = new Store<string>(null);

    this.ipc.on('layers', (layers: MainLayerExport) => {
      const {flat, lookup} = convert(layers);
      this.layers.set(layers);
      this.flat.set(flat);
      this.lookup.set(lookup);
    });
  }

  sidebar() {
    return {
      icon: 'Rows' as icons,
      render: <SidebarLeft layers={this} />,
    };
  }
}
