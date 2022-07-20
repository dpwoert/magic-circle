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
  border: 1px solid ${String(COLORS.shades.s400.opacity(0))};
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

export const Color = styled.div`
  ${TYPO.input}
  height: ${SPACING(2.75)}px;
  width: 100%;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.shades.s100.css};
  outline: none;
  border: 1px solid ${String(COLORS.shades.s400.opacity(0))};
  border-radius: 3px;
  transition: border-color 0.2s ease;
  padding: 0 ${SPACING(0.5)}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${SPACING(1)}px;

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
  border: 1px solid ${String(COLORS.shades.s400.opacity(0))};
  border-radius: 3px;
  transition: border-color 0.2s ease;
  padding: 0 ${SPACING(1)}px;

  &:focus {
    border: 1px solid ${COLORS.shades.s400.css};
  }
`;

const Box = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border: 1px solid ${COLORS.accent.css};
  border-radius: 3px;
  background: ${String(COLORS.accent.opacity(0))};
  transition: border 0.2s ease, background 0.2s ease;
  pointer-events: none;
`;

export const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 18px;
  height: 18px;

  &:checked + ${Box} {
    background: ${String(COLORS.accent.opacity(0.5))};
  }
`;

type CheckboxProps = {
  value: boolean;
  onChange: (newVal: boolean) => void;
};

export const Checkbox = ({ value, onChange, ...props }: CheckboxProps) => {
  return (
    <>
      <CheckboxInput
        checked={value}
        onChange={() => onChange(!value)}
        type="checkbox"
        {...props}
      />
      <Box />
    </>
  );
};

type ButtonProps = {
  highlight?: boolean;
};

export const Button = styled.button<ButtonProps>`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  padding: 0 ${SPACING(1)}px;
  gap: ${SPACING(0.5)}px;
  border: 1px solid
    ${(props) => (props.highlight ? COLORS.accent.css : COLORS.shades.s400.css)};
  border-radius: 5px;
  color: ${(props) =>
    props.highlight ? COLORS.white.css : COLORS.shades.s100.css};
  background: ${(props) =>
    props.highlight ? COLORS.accent.opacity(0.15) : COLORS.shades.s500.css};
  height: ${SPACING(3)}px;
  transition: color 0.2s ease;

  &:hover {
    color: ${COLORS.accent.css};
  }
`;

export const ButtonSmall = styled.button`
  ${TYPO.small}
  display: flex;
  align-items: center;
  padding: 0 ${SPACING(0.5)}px;
  gap: ${SPACING(0.25)}px;
  border: 1px solid ${COLORS.shades.s400.css};
  border-radius: 5px;
  color: ${COLORS.shades.s100.css};
  background: ${COLORS.shades.s500.css};
  height: 26px;
  transition: color 0.2s ease;

  &:hover {
    color: ${COLORS.accent.css};
  }
`;
