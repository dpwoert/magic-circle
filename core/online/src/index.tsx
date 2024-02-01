import React from 'react';
import mixpanel from 'mixpanel-browser';

import { Plugin, icons, ButtonCollections } from '@magic-circle/schema';
import {
  registerIcon,
  Video,
  Code,
  Github,
  Download,
} from '@magic-circle/styles';

import Sidebar from './Sidebar';

registerIcon(Video);
registerIcon(Code);
registerIcon(Download);
registerIcon(Github);

// Add some simple anonymous analytics
if (process.env.VITE_MIXPANEL_TOKEN_PLAYGROUND) {
  mixpanel.init(process.env.VITE_MIXPANEL_TOKEN_PLAYGROUND, {
    track_pageview: true,
    disable_persistence: true,
  });
}

export default class DemoPlugin extends Plugin {
  name = 'demo';

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

  sidebar() {
    return {
      icon: 'Video' as icons,
      name: 'demo',
      render: <Sidebar app={this.app} />,
    };
  }
}
