import { Plugin, icons, ButtonCollections } from '@magic-circle/schema';
import {
  registerIcon,
  Download,
  File,
  Folder,
  MenuPortal,
} from '@magic-circle/styles';

registerIcon(Download);
registerIcon(File);
registerIcon(Folder);

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
            tooltip: 'Download 3D file',
            onClick: () => {
              // todo
            },
            wrap: (inside) => (
              <MenuPortal
                showOnClick
                menu={{
                  items: [
                    {
                      label: 'Download as .glb',
                      icon: 'File',
                      onSelect: () => {
                        // todo
                      },
                    },
                    {
                      label: 'Download as .gltf',
                      icon: 'Folder',
                      onSelect: () => {
                        // todo
                      },
                    },
                  ],
                }}
              >
                {inside}
              </MenuPortal>
            ),
          },
        ],
      },
    };
  }
}
