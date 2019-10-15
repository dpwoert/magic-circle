import React from 'react';
import ReactDOM from 'react-dom';
import { Client, Layout } from '@magic-circle/ui/web';
import IframeIPC from './iframe-ipc';

const settings = {
  ipc: new IframeIPC(),
  plugins: defaultPlugins =>
    defaultPlugins.filter(p => p.name !== 'screenshots'),
  render: client => {
    ReactDOM.render(
      <Layout client={client} />,
      document.getElementById('root')
    );
  },
};

export default new Client(settings, '/');
