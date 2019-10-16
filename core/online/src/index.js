import React from 'react';
import ReactDOM from 'react-dom';
import { Client, Layout } from '@magic-circle/ui/web';
import { IframeIPC } from '@magic-circle/client';

const ipc = new IframeIPC();
ipc.selector('iframe');

const settings = {
  ipc,
  plugins: defaultPlugins =>
    defaultPlugins.filter(p => p.name !== 'screenshots'),
  render: client => {
    ReactDOM.render(
      <Layout client={client} />,
      document.getElementById('root')
    );
  },
};

// eslint-disable-next-line
new Client(settings, '/');
