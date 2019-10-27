import React from 'react';
import ReactDOM from 'react-dom';
import { Client, Layout } from '@magic-circle/ui/web';
import { IframeIPC } from '@magic-circle/client';

const iframe = document.querySelector('iframe');
const ipc = new IframeIPC();
ipc.selector('iframe');

const hashChange = () => {
  const hash = window.location.hash || '';
  iframe.src =
    hash !== '' && hash !== '#'
      ? window.location.hash.replace('#', '')
      : 'examples/simple/index.html';

  console.info('🌍 load url', iframe.src);
};

iframe.addEventListener('load', () => {
  ipc.send('editor-ready', true);
});

window.addEventListener('hashchange', hashChange);
hashChange();

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
