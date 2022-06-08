import React from 'react';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil';

import Header from './Header';
import SidebarLeft from './SidebarLeft';

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

export default function App() {
  return (
    <RecoilRoot>
      <Container>
        <Header />
        <Inside>
          <SidebarLeft />
          <Iframe />
        </Inside>
      </Container>
    </RecoilRoot>
  );
}
