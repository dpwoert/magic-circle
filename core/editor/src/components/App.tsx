import React from 'react';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil';

import Header from './Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Inside = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export default function App() {
  return (
    <RecoilRoot>
      <Container>
        <Header />
        <Inside>todo</Inside>
      </Container>
    </RecoilRoot>
  );
}
