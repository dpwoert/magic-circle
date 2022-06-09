import React from 'react';
import styled from 'styled-components';

import Header from './Header';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';

import APP from '../app/app';

import { BuildTarget } from '@magic-circle/schema';
import { SPACING, COLORS } from '@magic-circle/styles';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Inside = styled.div`
  flex: 1;
  display: flex;
`;

const Iframe = styled.iframe`
  flex: 1;
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
        {APP.config.target === BuildTarget.IFRAME ? (
          <Iframe src={APP.config.url} onLoad={() => APP.connect()} />
        ) : (
          <SpacerFrame />
        )}
        <SidebarRight />
      </Inside>
    </Container>
  );
}
