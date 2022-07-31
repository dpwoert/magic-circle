import React from 'react';
import styled from 'styled-components';

import { SPACING, COLORS } from '@magic-circle/styles';
import { LayoutHook } from '@magic-circle/schema';
import { useStore } from '@magic-circle/state';

import APP from '../app/app';

const Container = styled.div`
  display: flex;
  width: ${SPACING(23)}px;
  height: 100%;
`;

const Inside = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: 1px solid ${COLORS.shades.s300.css};
  background: ${COLORS.shades.s500.css};
`;

const SidebarRight = () => {
  const hooks = useStore(APP.layoutHooks);

  // not displaying when the inner hook is shown
  if (hooks[LayoutHook.INNER]) {
    return null;
  }

  return (
    <Container>
      <Inside>{hooks[LayoutHook.SIDEBAR_RIGHT]}</Inside>
    </Container>
  );
};

export default SidebarRight;
