import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './components/layout';

import Layers from './plugins/layers/layers';
import PlayControls from './plugins/play-controls/play-controls';
import Controls from './plugins/controls/controls';
import Seed from './plugins/seed/seed';
import PageInfo from './plugins/page-information/page-information';
import Screenshots from './plugins/screenshots/screenshots';

const settings = {
  plugins: [
    PageInfo,
    Seed,
    Layers,
    PlayControls,
    Controls,
    Screenshots
  ],
  render: client => {
    ReactDOM.render(<Layout client={client} />, document.getElementById('root'));
  }
};

export default settings;
