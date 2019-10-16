/* eslint-disable spaced-comment */

import React from 'react';
import ReactDOM from 'react-dom';

/*#if _WEB
const ipcRenderer = {};
//#else */
import { ipcRenderer } from 'electron';
//#endif

import Layers from '@magic-circle/layers';
import PlayControls from '@magic-circle/play-controls';
import Controls from '@magic-circle/controls';
import Seed from '@magic-circle/seed';
import PageInfo from '@magic-circle/page-information';
import Screenshots from '@magic-circle/screenshots';
import Performance from '@magic-circle/performance';
import Touchbar from '@magic-circle/touchbar';
// import Midi from '@magic-circle/midi';
import Fullscreen from '@magic-circle/fullscreen';

import Layout from './components/layout';

const settings = {
  ipc: ipcRenderer,
  plugins: [
    PageInfo,
    Seed,
    Layers,
    PlayControls,
    Controls,
    Screenshots,
    Performance,
    Fullscreen,
    Touchbar,
    // Midi,
  ],
  theme: {
    // accent: 'rgb(102, 255, 153)',
    accent: 'rgb(136, 74, 255)',
  },
  standalone: {
    path: '{userData}/',
  },
  render: client => {
    ReactDOM.render(
      <Layout client={client} />,
      document.getElementById('root')
    );
  },
};

export default settings;
