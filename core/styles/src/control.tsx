import type { ReactNode } from 'react';
import styled from 'styled-components';

import COLORS from './colors';
import TYPO from './typography';
import SPACING from './spacing';
import Icon from './Icon';

export const ContainerCSS = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: ${SPACING(4)}px;
  color: ${COLORS.shades.s100.css};
  border-bottom: 1px solid ${COLORS.shades.s400.css};
  overflow: hidden;
`;

type ResetProps = {
  hasChanges: boolean;
};

export const Reset = styled.div<ResetProps>`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.accent.css};
  color: ${COLORS.white.css};
  height: 100%;
  width: ${SPACING(4)}px;
  transform: ${(props) =>
    props.hasChanges
      ? 'translateX(-100%) translateX(3px)'
      : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  pointer-events: ${(props) => (props.hasChanges ? 'all' : 'none')};

  &:hover {
    transform: translateX(0);
  }
`;

export const ResetMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${SPACING(4)}px;
`;

type ContainerProps = {
  hasChanges: boolean;
  reset?: () => void;
  children: ReactNode;
};

export const Container = ({
  hasChanges,
  reset,
  children,
  ...props
}: ContainerProps) => {
  return (
    <ContainerCSS {...props}>
      <ResetMask>
        <Reset hasChanges={hasChanges} onClick={reset}>
          <Icon name="Refresh" width={SPACING(1.5)} height={SPACING(1.5)} />
        </Reset>
      </ResetMask>
      {children}
    </ContainerCSS>
  );
};

export const Label = styled.div`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  width: ${SPACING(8)}px;
  height: 100%;
  colors: ${COLORS.shades.s100.css};
  padding-left: ${SPACING(1)}px;
`;

export const Inside = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
  padding-right: ${SPACING(1)}px;
`;
