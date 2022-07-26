import React from 'react';
import styled from 'styled-components';

import Popover, { PopoverProps } from './Popover';

import SPACING from './spacing';
import COLORS from './colors';
import TYPO from './typography';

const Label = styled.div`
  background: ${COLORS.shades.s700.css};
  color: ${COLORS.shades.s100.css};
  padding: ${SPACING(0.5)}px ${SPACING(0.75)}px;
  pointer-events: none;
  display: inline-flex;
  white-space: nowrap;
  border-radius: 3px;
  z-index: 9;

  & span {
    ${TYPO.small}
  }
`;

interface TooltipProps extends PopoverProps {
  content: string | React.ReactNode;
}

export default function Tooltip({ content, ...props }: TooltipProps) {
  return (
    <Popover
      background={COLORS.shades.s700.css}
      content={
        <Label>
          <span>{content}</span>
        </Label>
      }
      {...props}
    />
  );
}
