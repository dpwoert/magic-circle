import React from 'react';
import styled from 'styled-components';

import { useStore } from '@magic-circle/state';
import { LayoutHook } from '@magic-circle/schema';
import { COLORS } from '@magic-circle/styles';

import APP from '../app/app';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.shades.s500.css};
`;

const Inner = () => {
  const hooks = useStore(APP.layoutHooks);

  if (!hooks[LayoutHook.INNER]) {
    return null;
  }

  return <Container>{hooks[LayoutHook.INNER]}</Container>;
};

export default Inner;
