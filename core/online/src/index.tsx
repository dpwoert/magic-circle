import React from 'react';

import type { Plugin, icons, App } from '@magic-circle/schema';

import Sidebar from './Sidebar.jsx';

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
