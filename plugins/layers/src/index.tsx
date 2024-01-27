import {
  Plugin,
  icons,
  MainLayerExport,
  LayerExport,
  LayoutHook,
  ControlExport,
} from '@magic-circle/schema';
import { Store, StoreFamily } from '@magic-circle/state';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  AnnotationWarning,
  registerIcon,
  Layers as LayersIcon,
} from '@magic-circle/styles';

import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';

registerIcon(LayersIcon);
registerIcon(ChevronDown);
registerIcon(ChevronRight);
registerIcon(ArrowRight);
registerIcon(AnnotationWarning);

type FlatListItem = LayerExport & {
  depth: number;
  hasChildren: boolean;
};

const convert = (main: MainLayerExport) => {
  const flat: FlatListItem[] = [];
  const lookup: Record<string, LayerExport | ControlExport> = {};

  const recursive = (layers: LayerExport['children'] = [], depth = 0) => {
    layers.forEach((child) => {
      lookup[child.path] = child;

      if ('folder' in child && !child.folder) {
        const hasChildren = child.children && child.children.length > 0;
        const childLayers =
          hasChildren && child.children.some((c) => 'folder' in c && !c.folder);

        flat.push({
          ...child,
          depth,
          hasChildren: childLayers,
        });
      }

      if ('children' in child && child.children) {
        recursive(child.children, depth + 1);
      }
    });
  };

  recursive(main);

  return { flat, lookup };
};

export type ExternalQuery = {
  label: string;
  icon: icons;
  filter: string;
  onSelect: (path: string) => void;
};

export default class Layers extends Plugin {
  layers = new Store<MainLayerExport>([]);
  flat = new Store<FlatListItem[]>([]);
  lookup = new StoreFamily<LayerExport | ControlExport>();
  selected = new Store<string | null>(null);
  depthStart = new Store<{ layer: LayerExport; depth: number } | null>(null);
  external = new Store<Record<string, string[]>>({});
  setExternal = new Store<ExternalQuery | null>(null);

  name = 'layers';

  async setup() {
    this.ipc.on('layers', (_, layers: MainLayerExport) => {
      const { flat, lookup } = convert(layers);
      this.layers.set(layers);
      this.flat.set(flat);
      this.lookup.set((id) => lookup[id]);
      this.lookup.keys(Object.keys(lookup));
    });
    this.ipc.on('control:set-value', (_, path: string, value: any) => {
      this.setControl(path, value);
    });

    // Set controls sidebar
    this.app.setLayoutHook(
      LayoutHook.SIDEBAR_RIGHT,
      <SidebarRight app={this.app} layers={this} />
    );

    // Track updates of selected layer and send to FE
    this.selected.onChange((path) => {
      if (path) {
        this.ipc.send('layer:visible', path);
      }
    });
  }

  sidebar() {
    return {
      icon: 'Layers' as icons,
      name: 'layers',
      render: <SidebarLeft layers={this} />,
    };
  }

  async load(data: Record<string, any>) {
    Object.keys(data).forEach((key) => this.setControl(key, data[key]));
  }

  hydrate() {
    const hydrate: Record<string, any> = {};
    this.lookup.export((key, value) => {
      if ('value' in value && !value.blockHydrate) {
        hydrate[key] = value.value;
      }
    });
    return hydrate;
  }

  async save() {
    const toSave: Record<string, any> = {};

    this.lookup.export((key, value) => {
      if (value && 'value' in value && value.value) {
        toSave[key] = value.value;
      }
    });

    return toSave;
  }

  setControl<T>(path: string, newValue: T) {
    const store = this.lookup.get(path);

    if (!store || !store.value) {
      throw new Error('Trying to update value of non-existent control');
    }

    // Save changes locally
    store.set({
      ...store.value,
      value: newValue,
    });

    // send changes to FE
    this.ipc.send('control:set', path, newValue);
  }

  async reset() {
    this.layers.set([]);
    this.flat.set([]);
    this.selected.set(null);
    this.lookup.reset();
    this.external.set({});
    this.setExternal.set(null);
  }

  preConnect() {
    this.reset();
  }

  resetControl(path: string) {
    const store = this.lookup.get(path);

    if (store && store.value && 'initialValue' in store.value) {
      this.setControl(path, store.value.initialValue);
    }
  }

  getControlRenderer(type: string) {
    return this.app.controls[type]?.render;
  }

  getControl(type: string) {
    return this.app.controls[type];
  }
}
