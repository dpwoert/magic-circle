import React from 'react';
import styled from 'styled-components';

import { AppProvider } from '@magic-circle/state';
import {
  COLORS,
  registerIcon,
  Close,
  Command,
  Search,
  Delete,
} from '@magic-circle/styles';

import Header from './Header';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import CommandLine from './CommandLine';
import Inner from './Inner';

import APP from '../app/app';

registerIcon(Close);
registerIcon(Command);
registerIcon(Search);
registerIcon(Delete);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Inside = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`;

const Frame = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  background: ${COLORS.white.css};
  border: none;
`;

const Iframe = styled.iframe`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${COLORS.white.css};
  border: none;
`;

// const SpacerFrame = styled.div`
//   flex: 1;
//   height: 100%;
//   background: ${COLORS.white.css};
// `;

export default function App() {
  const url =
    typeof APP.config.url === 'string'
      ? APP.config.url
      : APP.config.url(process.env.BUILD_ENV === 'develop');

  return (
    <AppProvider app={APP}>
      <Container>
        <Header />
        <Inside>
          <SidebarLeft />
          <Frame id="frame">
            <Iframe
              allow="display-capture"
              src={url}
              onLoad={() => APP.setup()}
            />
            <Inner />
          </Frame>
          <SidebarRight />
        </Inside>
        <CommandLine />
      </Container>
    </AppProvider>
  );
}
