import type { ReactNode } from 'react';
import styled from 'styled-components';

import COLORS from './colors';
import TYPO from './typography';
import SPACING from './spacing';
import Icon, { IconName } from './Icon';
import { ButtonSmall } from './forms';
import { formatNumber } from './utils';

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
  color: ${COLORS.black.css};
  height: 100%;
  width: ${SPACING(4)}px;
  transform: ${(props) =>
    props.hasChanges
      ? 'translateX(-100%) translateX(4px)'
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

const Select = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: ${SPACING(15)}px;
  background: linear-gradient(
    270deg,
    ${COLORS.shades.s600.css} 55%,
    ${COLORS.shades.s600.opacity(0)} 100%
  );
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: ${SPACING(1)}px;
`;

type ContainerProps = {
  hasChanges: boolean;
  reset?: () => void;
  children: ReactNode;
  select?: {
    label: string;
    icon: IconName;
    onSelect: () => void;
  };
};

export const Container = ({
  hasChanges,
  reset,
  children,
  select,
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
      {select && (
        <Select>
          <ButtonSmall onClick={select.onSelect}>
            <Icon name={select.icon} width={SPACING(1)} height={SPACING(1)} />
            {select.label}
          </ButtonSmall>
        </Select>
      )}
    </ContainerCSS>
  );
};

const LabelStyled = styled.div`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  width: ${SPACING(8)}px;
  height: 100%;
  colors: ${COLORS.shades.s100.css};
  padding-left: ${SPACING(1)}px;
  padding-right: ${SPACING(0.5)}px;

  & > span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const Label = ({ children, ...props }) => {
  return (
    <LabelStyled {...props}>
      <span>{children}</span>
    </LabelStyled>
  );
};

export const Inside = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
  padding-right: ${SPACING(1)}px;
`;

type ValueProps = {
  children: number;
  maxDigits?: number;
  suffix?: string;
};

export const Value = ({
  children,
  maxDigits,
  suffix,
  ...props
}: ValueProps) => {
  return (
    <div {...props}>
      {formatNumber(children, maxDigits)}
      {suffix}
    </div>
  );
};

type LargeProps = ContainerProps & { header: ReactNode };

export const Large = ({ header, children, ...props }: LargeProps) => {
  return (
    <div>
      <Container {...props}>{header}</Container>
      {children}
    </div>
  );
};
