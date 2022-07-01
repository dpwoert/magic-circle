import React from 'react';

import type { Plugin, icons, App } from '@magic-circle/schema';
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

  sidebar() {
    return {
      icon: 'Video' as icons,
      name: 'demo',
      render: <Sidebar />,
    };
  }
}
