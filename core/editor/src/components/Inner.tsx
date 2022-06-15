import React from 'react';
import styled from 'styled-components';

import { useStore } from '@magic-circle/state';
import { LayoutHook } from '@magic-circle/schema';
import { SPACING, COLORS, TYPO, Icon } from '@magic-circle/styles';

import APP from '../app/app';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.shades.s500.css};
`;

const Close = styled.div`
  position: absolute;
  top: ${SPACING(2)}px;
  right: ${SPACING(2)}px;
  width: ${SPACING(3)}px;
  height: ${SPACING(3)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${COLORS.accent.css};
  border-radius: 5px;
  background: ${COLORS.accent.opacity(0.15)};
  color: ${COLORS.accent.css};
  cursor: pointer;
`;

const Inner = () => {
  const hooks = useStore(APP.layoutHooks);

  if (!hooks[LayoutHook.INNER]) {
    return null;
  }

  return (
    <Container>
      {hooks[LayoutHook.INNER]}
      <Close
        onClick={() => {
          APP.layoutHooks.set({
            ...APP.layoutHooks,
            [LayoutHook.INNER]: undefined,
          });
        }}
      >
        <Icon name="Close" width={SPACING(1.5)} height={SPACING(1.5)} />
      </Close>
    </Container>
  );
};

export default Inner;
