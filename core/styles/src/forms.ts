import styled from 'styled-components';

import COLORS from './colors';
import TYPO from './typography';
import SPACING from './spacing';

export const Field = styled.input`
  ${TYPO.input}
  height: ${SPACING(2.75)}px;
  width: 100%;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.shades.s100.css};
  outline: none;
  border: 1px solid ${COLORS.shades.s400.opacity(0)};
  border-radius: 3px;
  transition: border-color 0.2s ease;
  padding: 0 ${SPACING(1)}px;

  &[type='number'] {
    -moz-appearance: textfield;
    text-align: right;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &:focus {
    border: 1px solid ${COLORS.shades.s400.css};
  }
`;

export const Select = styled.select`
  ${TYPO.input}
  height: ${SPACING(2.75)}px;
  width: 100%;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.shades.s100.css};
  outline: none;
  border: 1px solid ${COLORS.shades.s400.opacity(0)};
  border-radius: 3px;
  transition: border-color 0.2s ease;
  padding: 0 ${SPACING(1)}px;

  &:focus {
    border: 1px solid ${COLORS.shades.s400.css};
  }
`;
