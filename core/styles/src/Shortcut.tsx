import styled from 'styled-components';

import COLORS from './colors';
import TYPO from './typography';
import SPACING from './spacing';
import Icon from './Icon';

const Container = styled.div`
  display: flex;
  gap: 3px;
`;

type KeyProps = {
  color: string;
  backgroundColor: string;
};

const Key = styled.div<KeyProps>`
  ${TYPO.small}
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SPACING(2)}px;
  height: ${SPACING(2)}px;
  color: ${(props) => props.color};
  background: ${(props) => props.backgroundColor};
  border-radius: 5px;
`;

type ShortcutProps = {
  shortcut: string;
  color?: string;
  backgroundColor?: string;
};

const Shortcut = ({
  shortcut,
  color = COLORS.white.css,
  backgroundColor = COLORS.shades.s700.css,
}: ShortcutProps) => {
  if (!shortcut) return null;
  const split = shortcut.split('+');

  return (
    <Container>
      {split.map((command) => {
        if (command === 'platform') {
          return (
            <Key color={color} backgroundColor={backgroundColor}>
              <Icon name="Command" width={SPACING(1)} height={SPACING(1)} />
            </Key>
          );
        }
        if (command === 'backspace') {
          return (
            <Key color={color} backgroundColor={backgroundColor}>
              <Icon name="Delete" width={SPACING(1)} height={SPACING(1)} />
            </Key>
          );
        }
        if (command === 'shift') {
          return (
            <Key color={color} backgroundColor={backgroundColor}>
              <Icon name="Upload" width={SPACING(1)} height={SPACING(1)} />
            </Key>
          );
        }
        if (command === 'up') {
          return (
            <Key color={color} backgroundColor={backgroundColor}>
              <Icon name="ArrowUp" width={SPACING(1)} height={SPACING(1)} />
            </Key>
          );
        }
        if (command === 'down') {
          return (
            <Key color={color} backgroundColor={backgroundColor}>
              <Icon name="ArrowDown" width={SPACING(1)} height={SPACING(1)} />
            </Key>
          );
        }
        if (command === 'left') {
          return (
            <Key color={color} backgroundColor={backgroundColor}>
              <Icon name="ArrowLeft" width={SPACING(1)} height={SPACING(1)} />
            </Key>
          );
        }
        if (command === 'right') {
          return (
            <Key color={color} backgroundColor={backgroundColor}>
              <Icon name="ArrowRight" width={SPACING(1)} height={SPACING(1)} />
            </Key>
          );
        }

        return (
          <Key color={color} backgroundColor={backgroundColor}>
            {command}
          </Key>
        );
      })}
    </Container>
  );
};

export default Shortcut;
