import { useCallback, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';

import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import { SPACING, COLORS, TYPO, Control } from '@magic-circle/styles';

import { clamp, nrDigits } from './utils';

const InputContainer = styled.div`
  position: relative;
  flex: 1;
  height: ${SPACING(2)}px;
  cursor: pointer;
  background: ${COLORS.shades.s600.css};
  border: 1px solid ${COLORS.shades.s300.css};
  border-radius: 5px;
  overflow: hidden;
`;

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Value = styled(Control.Value)`
  ${TYPO.small}
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  width: ${SPACING(4)}px;
  text-align: right;

  sup {
    font-size: 60%;
  }
`;

type options = {
  mode?: 'radians' | 'degrees';
  range?: number[];
  stepSize?: number;
};

type DisplayMode = 'degrees' | 'radians';

const RotationControlField = ({
  value,
  label,
  options,
  set,
  hasChanges,
  select,
  reset,
}: ControlProps<number, options>) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('degrees');
  const [moved, setMoved] = useState(0);
  const isDragging = useRef(false);
  const lastX = useRef<number>(null);

  const { range } = options;
  const mode = options.mode || 'radians';
  const stepSize = options.stepSize || mode === 'radians' ? 0.01 : 1;

  const digits = useMemo(
    () => Math.max(nrDigits(stepSize), nrDigits(value)),
    [stepSize, value]
  );

  const displayDigits = displayMode === 'radians' ? 3 : 1;

  const degrees = useMemo(() => {
    return mode === 'degrees' ? value : value * (180 / Math.PI);
  }, [value, mode]);

  const radians = useMemo(() => {
    return mode === 'radians' ? value : value * (Math.PI / 180);
  }, [value, mode]);

  const lines = useMemo(() => {
    return new Array(10).fill(0).map((_, i) => (moved % 12) + i * 12);
  }, [moved]);

  const setValue = useCallback(
    (newValue: number) => {
      const max = mode === 'radians' ? Math.PI * 2 : 360;
      let valueSafe = newValue % max;

      if (range) {
        valueSafe = clamp(valueSafe, range[0], range[1]);
      }

      valueSafe = valueSafe < 0 ? max + valueSafe : valueSafe;
      set(+valueSafe.toFixed(digits));

      return valueSafe;
    },
    [digits, mode, range, set]
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const onMouseMove = useCallback(
    (evt: React.MouseEvent) => {
      const delta = lastX.current ? evt.clientX - lastX.current : 0;
      lastX.current = evt.clientX;

      if (isDragging.current) {
        const newVal = value + delta * stepSize;
        if (setValue(newVal) !== value) {
          // only move when we're updating
          setMoved((c) => c + delta);
        }
      }
    },
    [value, stepSize, setValue]
  );

  return (
    <Control.Container hasChanges={hasChanges} reset={reset} select={select}>
      <Control.Label>{label}</Control.Label>
      <Control.Inside>
        <InputContainer
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseUp}
          onMouseUp={onMouseUp}
        >
          <Svg>
            <mask id="mask">
              <defs>
                <radialGradient
                  id="radial"
                  gradientTransform="translate(0,0) scale(1, 1)"
                >
                  <stop offset="0%" stop-color={COLORS.white.opacity(1)} />
                  <stop offset="100%" stop-color={COLORS.white.opacity(0)} />
                </radialGradient>
              </defs>
              <rect fill="url(#radial)" height="100%" width="100%" />
            </mask>
            <g mask="url(#mask)">
              {lines.map((l) => (
                <line
                  x1={l}
                  x2={l}
                  y1={0}
                  y2={SPACING(2)}
                  stroke={COLORS.shades.s400.css}
                  strokeWidth={1}
                  key={l}
                />
              ))}
            </g>
          </Svg>
        </InputContainer>
        <Value
          maxDigits={displayDigits}
          suffix={displayMode === 'degrees' ? '°' : <sup>R</sup>}
          onClick={() =>
            setDisplayMode(displayMode === 'radians' ? 'degrees' : 'radians')
          }
        >
          {displayMode === 'degrees' ? degrees : radians}
        </Value>
      </Control.Inside>
    </Control.Container>
  );
};

const RotationControl: ControlSchema<number, options> = {
  name: 'rotation',
  supports: (type, options: options) => {
    if (type === 'timeline' && options.range) {
      return true;
    }

    return false;
  },
  render: (props) => {
    return <RotationControlField {...props} />;
  },
};

export default RotationControl;
