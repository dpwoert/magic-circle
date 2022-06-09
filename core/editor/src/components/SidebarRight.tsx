import React from 'react';
import styled from 'styled-components';

import { SPACING, COLORS, Icon } from '@magic-circle/styles';

const Container = styled.div`
  display: flex;
  width: ${SPACING(23)}px;
  height: 100%;
`;

const Inside = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  border-right: 1px solid ${COLORS.shades.s300.css};
`;

const SidebarRight = () => {
  // todo

  return (
    <Container>
      <Inside>todo</Inside>
    </Container>
  );
};

export default SidebarRight;
