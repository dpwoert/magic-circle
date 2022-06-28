import React from 'react';
import styled from 'styled-components';

import COLORS from './colors';
import TYPO from './typography';
import SPACING from './spacing';
import Icon, { register as registerIcon } from './Icon';

import { WarningTriangle } from './assets/icons';

registerIcon(WarningTriangle);

const Container = styled.div`
  ${TYPO.small}
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  color: ${COLORS.white.css};
  gap: ${SPACING(1)}px;
  padding: ${SPACING(6)}px ${SPACING(1)}px;
`;

type WarningProps = {
  text: string;
};

const Warning = ({ text }: WarningProps) => {
  return (
    <Container>
      <Icon name="WarningTriangle" height={SPACING(2)} width={SPACING(2)} />
      {text}
    </Container>
  );
};

export default Warning;
