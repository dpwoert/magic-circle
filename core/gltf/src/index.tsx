import { ReactNode } from 'react';
import { Plugin, icons, ButtonCollections } from '@magic-circle/schema';
import {
  registerIcon,
  FloppyDisc,
  File,
  Folder,
  MenuPortal,
} from '@magic-circle/styles';

registerIcon(FloppyDisc);
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
            label: 'Save',
            icon: 'FloppyDisc' as icons,
            tooltip: 'Download 3D file',
            onClick: () => {
              // todo
            },
            wrap: (inside: ReactNode) => (
              <MenuPortal
                showOnClick
                menu={{
                  items: [
                    {
                      label: 'Download as .glb',
                      icon: 'File',
                      onSelect: () => {
                        this.app.ipc.send('gltf:download', true);
                      },
                    },
                    {
                      label: 'Download as .gltf',
                      icon: 'Folder',
                      onSelect: () => {
                        this.app.ipc.send('gltf:download', false);
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
