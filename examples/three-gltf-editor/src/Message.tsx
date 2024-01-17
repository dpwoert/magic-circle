import React from 'react';
import styled from 'styled-components';

import {
  COLORS,
  TYPO,
  SPACING,
  Icon,
  Forms,
  IconName,
} from '@magic-circle/styles';

const Container = styled.div`
  ${TYPO.small}
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  color: ${COLORS.white.css};
  gap: ${SPACING(1)}px;
  padding: ${SPACING(6)}px ${SPACING(1)}px;
`;

const ButtonStyled = styled(Forms.Button)`
  margin-top: ${SPACING(3)}px;
  color: ${COLORS.white.css};
  border-color: ${COLORS.accent.css};
`;

type MessageProps = {
  icon: IconName;
  text: string;
  button?: {
    label: string;
    icon: IconName;
    onClick?: () => void;
  };
};

const Message = ({ icon, text, button }: MessageProps) => {
  return (
    <Container>
      <Icon name={icon} height={SPACING(2)} width={SPACING(2)} />
      {text}
      {button && (
        <ButtonStyled onClick={button.onClick}>
          <Icon name={button.icon} height={SPACING(1.5)} width={SPACING(1.5)} />
          {button.label}
        </ButtonStyled>
      )}
    </Container>
  );
};

export default Message;
