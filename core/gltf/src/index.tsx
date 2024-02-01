import React, { ReactNode } from 'react';
import mixpanel from 'mixpanel-browser';

import {
  Plugin,
  icons,
  ButtonCollections,
  LayoutHook,
} from '@magic-circle/schema';
import {
  registerIcon,
  FloppyDisc,
  File,
  Folder,
  MenuPortal,
  Scale,
  Move,
  Rotate,
  Cursor,
} from '@magic-circle/styles';

import Header from './Header';

registerIcon(FloppyDisc);
registerIcon(File);
registerIcon(Folder);
registerIcon(Scale);
registerIcon(Move);
registerIcon(Rotate);
registerIcon(Cursor);

// Add some simple anonymous analytics
if (
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN_GLTF &&
  typeof window !== 'undefined'
) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN_GLTF, {
    track_pageview: true,
    disable_persistence: true,
  });
}

export default class DemoPlugin extends Plugin {
  name = 'gltf';

  async setup() {
    // Set controls sidebar
    this.app.setLayoutHook(LayoutHook.HEADER_RIGHT, <Header app={this.app} />);
  }

  buttons(buttons: ButtonCollections) {
    return {
      ...buttons,
      gltf: {
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
                key="download"
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
                key="add:lights"
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
                key="add:mesh"
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
                      disabled: true,
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
          {
            label: 'Add group',
            icon: 'Minimize' as icons,
            tooltip: 'add:group',
            onClick: () => {
              this.app.ipc.send('add:group');
            },
          },
        ],
      },
      website: {
        after: 'screenshots',
        list: [
          {
            label: 'Information',
            icon: 'Information' as icons,
            tooltip: 'Visit Magic Circle website',
            onClick: () => {
              window.open('https://magic-circle.dev', '_blank');
            },
          },
        ],
      },
    };
  }
}
