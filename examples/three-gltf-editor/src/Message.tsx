import React from 'react';
import styled, { keyframes } from 'styled-components';

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

const spinnerAnim = keyframes`
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  `;

const Spinner = styled.div`
  color: ${COLORS.white.css};
  font-size: 3px;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;

  margin-bottom: ${SPACING(1)}px;

  &,
  &:before,
  &:after {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    animation-fill-mode: both;
    animation: ${spinnerAnim} 1.8s infinite ease-in-out;
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
  }
  &:before {
    left: -3.5em;
    animation-delay: -0.32s;
  }
  &:after {
    left: 3.5em;
  }
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
      {icon === 'Spinner' ? (
        <Spinner />
      ) : (
        <Icon name={icon} height={SPACING(2)} width={SPACING(2)} />
      )}
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
