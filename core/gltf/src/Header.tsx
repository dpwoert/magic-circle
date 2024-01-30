import React, { useState } from 'react';
import styled from 'styled-components';

import { App } from '@magic-circle/schema';
import {
  Tooltip,
  SPACING,
  COLORS,
  Placement,
  Icon,
} from '@magic-circle/styles';

const ButtonCollection = styled.div`
  display: flex;
  color: ${COLORS.accent.css};
  border: 1px solid ${COLORS.accent.css};
  border-radius: 5px;
  height: ${SPACING(3)}px;
`;

type ButtonProps = {
  active?: boolean;
  isLast?: boolean;
};

const Button = styled(Tooltip).withConfig({
  shouldForwardProp: (prop) => ['active', 'isLast'].includes(prop) === false,
})<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SPACING(3)}px;
  height: ${SPACING(3) - 2}px;
  border-right: ${(props) => (props.isLast ? 0 : 1)}px solid
    ${COLORS.accent.css};
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${(props) =>
    props.active ? COLORS.accent.opacity(0.2) : 'none'};

  &:hover {
    background: ${String(COLORS.accent.opacity(0.2))};
  }
`;

type HeaderProps = {
  app: App;
};

const Header = ({ app }: HeaderProps) => {
  const [active, setActive] = useState('cursor');
  return (
    <ButtonCollection>
      <Button
        onClick={() => {
          setActive('cursor');
          app.ipc.send('gltf:transform', null);
        }}
        content="Use cursor to rotate around"
        placement={Placement.BOTTOM}
        active={active === 'cursor'}
      >
        <Icon name="Cursor" width={SPACING(2)} height={SPACING(2)} />
      </Button>
      <Button
        onClick={() => {
          setActive('translate');
          app.ipc.send('gltf:transform', 'translate');
        }}
        content="Move selected object around"
        placement={Placement.BOTTOM}
        active={active === 'translate'}
      >
        <Icon name="Move" width={SPACING(2)} height={SPACING(2)} />
      </Button>
      <Button
        onClick={() => {
          setActive('rotate');
          app.ipc.send('gltf:transform', 'rotate');
        }}
        content="Rotate selected object around"
        placement={Placement.BOTTOM}
        active={active === 'rotate'}
      >
        <Icon name="Rotate" width={SPACING(2)} height={SPACING(2)} />
      </Button>
      <Button
        onClick={() => {
          setActive('scale');
          app.ipc.send('gltf:transform', 'scale');
        }}
        content="Scale selected object"
        placement={Placement.BOTTOM}
        active={active === 'scale'}
        isLast
      >
        <Icon name="Scale" width={SPACING(2)} height={SPACING(2)} />
      </Button>
    </ButtonCollection>
  );
};

export default Header;
