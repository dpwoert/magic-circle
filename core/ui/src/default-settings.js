import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './components/layout';

import Layers from '@creative-controls/layers';
import PlayControls from '@creative-controls/play-controls';
import Controls from '@creative-controls/controls';
import Seed from '@creative-controls/seed';
import PageInfo from '@creative-controls/page-information';
import Screenshots from '@creative-controls/screenshots';

const settings = {
  plugins: [
    PageInfo,
    Seed,
    Layers,
    PlayControls,
    Controls,
    Screenshots
  ],
  theme: {
    accent: 'rgb(136, 74, 255)',
  },
  render: client => {
    ReactDOM.render(<Layout client={client} />, document.getElementById('root'));
  }
};

export default settings;
