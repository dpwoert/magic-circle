import { Plugin, icons } from '@magic-circle/schema';

import Sidebar from './Sidebar';

export default class Layers implements Plugin {
  name = 'Layers';

  async setup() {
    // todo
  }

  sidebar() {
    return {
      icon: 'Rows' as icons,
      render: <Sidebar />,
    };
  }
}
