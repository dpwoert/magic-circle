import React from 'react';
import styled from 'styled-components';

import { BuildTarget } from '@magic-circle/schema';
import { SPACING, COLORS } from '@magic-circle/styles';

import Header from './Header';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import CommandLine from './CommandLine';
import Inner from './Inner';

import APP from '../app/app';

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

const SpacerFrame = styled.div`
  flex: 1;
  height: 100%;
  background: ${COLORS.white.css};
`;

export default function App() {
  return (
    <Container>
      <Header />
      <Inside>
        <SidebarLeft />
        <Frame id="frame">
          {APP.config.target === BuildTarget.IFRAME ? (
            <Iframe
              allow="display-capture"
              src={APP.config.url}
              onLoad={() => APP.connect()}
            />
          ) : (
            <SpacerFrame />
          )}
          <Inner />
        </Frame>
        <SidebarRight />
      </Inside>
      <CommandLine />
    </Container>
  );
}
