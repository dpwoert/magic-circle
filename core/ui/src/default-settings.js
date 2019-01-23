import React from 'react';
import ReactDOM from 'react-dom';

import Layers from '@creative-controls/layers';
import PlayControls from '@creative-controls/play-controls';
import Controls from '@creative-controls/controls';
import Seed from '@creative-controls/seed';
import PageInfo from '@creative-controls/page-information';
import Screenshots from '@creative-controls/screenshots';
import Performance from '@creative-controls/performance';

import Debug from '@creative-controls/debug';
import Fullscreen from '@creative-controls/fullscreen';

import Layout from './components/layout';

const settings = {
  plugins: [
    PageInfo,
    Seed,
    Layers,
    PlayControls,
    Controls,
    Screenshots,
    Performance,
    Debug,
    Fullscreen,
  ],
  theme: {
    // accent: 'rgb(102, 255, 153)',
    accent: 'rgb(136, 74, 255)',
  },
  render: client => {
    ReactDOM.render(
      <Layout client={client} />,
      document.getElementById('root')
    );
  },
};

export default settings;
