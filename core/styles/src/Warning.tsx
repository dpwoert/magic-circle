import React from 'react';
import styled from 'styled-components';

import COLORS from './colors';
import TYPO from './typography';
import SPACING from './spacing';
import Icon, { IconName, register as registerIcon } from './Icon';
import * as Form from './forms';

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

const ButtonStyled = styled(Form.Button)`
  margin-top: ${SPACING(3)}px;
  color: ${COLORS.white.css};
  border-color: ${COLORS.accent.css};
`;

type WarningProps = {
  text: string;
  button?: {
    icon: IconName;
    label: string;
    onClick: () => void;
  };
};

const Warning = ({ text, button }: WarningProps) => {
  return (
    <Container>
      <Icon name="WarningTriangle" height={SPACING(2)} width={SPACING(2)} />
      {text}
      {button && (
        <ButtonStyled onClick={() => button.onClick()}>
          <Icon name={button.icon} height={SPACING(1.5)} width={SPACING(1.5)} />
          {button.label}
        </ButtonStyled>
      )}
    </Container>
  );
};

export default Warning;
