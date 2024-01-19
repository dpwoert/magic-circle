import React, { ReactNode } from 'react';
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
          {
            label: 'Add light',
            icon: 'Sun' as icons,
            tooltip: 'Add light source',
            onClick: () => {
              // todo
            },
            wrap: (inside: ReactNode) => (
              <MenuPortal
                showOnClick
                menu={{
                  items: [
                    {
                      label: 'Direction light',
                      icon: 'Sun',
                      onSelect: () => {
                        this.app.ipc.send('add:light', 'directional');
                      },
                    },
                    {
                      label: 'Point light',
                      icon: 'Sun',
                      onSelect: () => {
                        this.app.ipc.send('add:light', 'point');
                      },
                    },
                    {
                      label: 'Spot light',
                      icon: 'Sun',
                      onSelect: () => {
                        this.app.ipc.send('add:light', 'spot');
                      },
                    },
                    {
                      label: 'Ambient light',
                      icon: 'Sun',
                      onSelect: () => {
                        this.app.ipc.send('add:light', 'ambient');
                      },
                    },
                    {
                      label: 'Hemisphere light',
                      icon: 'Sun',
                      onSelect: () => {
                        this.app.ipc.send('add:light', 'hemisphere');
                      },
                    },
                  ],
                }}
              >
                {inside}
              </MenuPortal>
            ),
          },
          {
            label: 'Add mesh',
            icon: 'Box' as icons,
            tooltip: 'Add mesh',
            onClick: () => {
              // todo
            },
            wrap: (inside: ReactNode) => (
              <MenuPortal
                showOnClick
                menu={{
                  items: [
                    {
                      label: 'Plane',
                      icon: 'Box',
                      onSelect: () => {
                        this.app.ipc.send('add:mesh', 'plane');
                      },
                    },
                    {
                      label: 'Cube',
                      icon: 'Box',
                      onSelect: () => {
                        this.app.ipc.send('add:mesh', 'cube');
                      },
                    },
                    {
                      label: 'Sphere',
                      icon: 'Box',
                      onSelect: () => {
                        this.app.ipc.send('add:mesh', 'sphere');
                      },
                    },
                    {
                      label: 'GLTF',
                      icon: 'File',
                      onSelect: () => {
                        this.app.ipc.send('add:mesh', 'gltf');
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
