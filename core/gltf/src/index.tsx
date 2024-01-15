import { Plugin, icons, ButtonCollections } from '@magic-circle/schema';
import { registerIcon, Download } from '@magic-circle/styles';

registerIcon(Download);

export default class DemoPlugin extends Plugin {
  name = 'gltf';

  async setup() {
    // not needed
  }

  buttons(buttons: ButtonCollections) {
    return {
      ...buttons,
      website: {
        after: 'screenshots',
        list: [
          {
            label: 'Download',
            icon: 'Download' as icons,
            tooltip: 'Download .GLB file',
            onClick: () => {
              // todo
            },
          },
        ],
      },
    };
  }
}
