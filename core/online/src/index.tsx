import React from 'react';

import type {
  Plugin,
  icons,
  App,
  ButtonCollections,
} from '@magic-circle/schema';
import { registerIcon, Video, Code, Download } from '@magic-circle/styles';

import Sidebar from './Sidebar';

registerIcon(Video);
registerIcon(Code);
registerIcon(Download);

export default class DemoPlugin implements Plugin {
  client: App;

  name = 'demo';

  async setup(client: App) {
    this.client = client;
  }

  buttons(buttons: ButtonCollections) {
    return {
      ...buttons,
      demo: [
        {
          label: 'Information',
          icon: 'Information' as icons,
          onClick: () => {
            window.open('https://github.com/dpwoert/magic-circle', '_blank');
          },
        },
      ],
    };
  }

  sidebar() {
    return {
      icon: 'Video' as icons,
      name: 'demo',
      render: <Sidebar app={this.client} />,
    };
  }
}
