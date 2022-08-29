import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import {
  SPACING,
  COLORS,
  TYPO,
  Control,
  Forms,
  utils,
} from '@magic-circle/styles';

const InputContainer = styled.div`
  position: relative;
  flex: 1;
  height: ${SPACING(2)}px;
  cursor: ew-resize;
  background: ${COLORS.shades.s600.css};
`;

const Slider = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  background: none;
  cursor: ew-resize;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 2px;
    height: 20px;
    background: ${COLORS.accent.css};
    cursor: ew-resize;
  }
  &::-webkit-slider-runnable-track {
    height: 20px;
    background: none;
  }
  &:focus {
    outline: none;
  }
`;

const Progress = styled.div.attrs((props) => ({
  style: {
    left: `${props.left}%`,
    width: `${props.width}%`,
  },
}))`
  position: absolute;
  top: 0;
  height: 100%;
  background: ${COLORS.accent.opacity(0.15)};
  cursor: grab;
`;

const Value = styled(Control.Value)`
  ${TYPO.small}
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  width: ${SPACING(4)}px;
  text-align: right;
`;

const NumberStepper = styled(Forms.Field)`
  cursor: ns-resize;
`;

const mapLinear = (x, a1, a2, b1, b2): number =>
  b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};

const nrDigits = (val: number): number => {
  const split = String(val).split('.');
  return split.length > 1 ? split[1].length : 0;
};

const STEP_SIZE = 25;

type options = {
  range?: number[];
  stepSize?: number;
};

const NumberControlContinuous = ({
  value,
  label,
  options,
  set,
  hasChanges,
  select,
  reset,
}: ControlProps<number, options>) => {
  const { range, stepSize } = options;
  const biDirectional = Math.abs(range[0]) === Math.abs(range[1]);

  const valSafe = clamp(value, range[0], range[1]);
  const progress = ((valSafe - range[0]) * 100) / (range[1] - range[0]);
  const extent = Math.abs(range[1] - range[0]);
  const step = !stepSize || stepSize === 0 ? extent / 100 : stepSize;

  const x1 = mapLinear(0, range[0], range[1], 0, 100);
  const x2 = mapLinear(valSafe, range[0], range[1], 0, 100);
  const width = biDirectional ? Math.abs(x1 - x2) : progress;
  const left = biDirectional ? Math.min(x1, x2) : 0;

  return (
    <Control.Container hasChanges={hasChanges} reset={reset} select={select}>
      <Control.Label>{label}</Control.Label>
      <Control.Inside>
        <InputContainer>
          <Progress left={left} width={width} />
          <Slider
            value={valSafe}
            onChange={(evt) => {
              set(+evt.target.value);
            }}
            type="range"
            min={range[0]}
            max={range[1]}
            step={step}
          />
        </InputContainer>
        <Value>{value}</Value>
      </Control.Inside>
    </Control.Container>
  );
};

const NumberControlStepper = ({
  value,
  label,
  options,
  set,
  reset,
  hasChanges,
}: ControlProps<number, options>) => {
  const [valueSafe, setValueSafe] = useState<number | string>(value);
  const drag = useRef<{ start: number; value: number }>({
    start: null,
    value: null,
  });

  const dragEvent = useCallback(
    (e) => {
      const delta = e.clientY - drag.current.start;
      const steps = Math.floor(delta / STEP_SIZE);
      const stepSize = options.stepSize || 1;

      const newValue = drag.current.value + steps * stepSize;
      const digits = Math.max(nrDigits(stepSize), nrDigits(value));
      const rounded = utils.formatNumber(newValue, digits);

      set(+rounded);
    },
    [options, set]
  );

  const endDrag = useCallback(() => {
    document.querySelector('body').style.cursor = 'auto';
    window.removeEventListener('mousemove', dragEvent);
    window.removeEventListener('mouseup', endDrag);
  }, [dragEvent]);

  const startDrag = useCallback(
    (e) => {
      drag.current.start = e.clientY;
      drag.current.value = value;

      window.addEventListener('mousemove', dragEvent);
      window.addEventListener('mouseup', endDrag);

      document.querySelector('body').style.cursor = 'ns-resize';
    },
    [endDrag, dragEvent, value]
  );

  const updateControl = useCallback(
    (value: string) => {
      const number = parseInt(value, 10);

      if (!isNaN(number)) {
        set(number);
        setValueSafe(number);
      } else {
        setValueSafe(value);
      }
    },
    [set]
  );

  useEffect(() => {
    if (value !== valueSafe) {
      setValueSafe(value);
    }
  }, [value, valueSafe]);

  return (
    <Control.Container hasChanges={hasChanges} reset={reset}>
      <Control.Label>{label}</Control.Label>
      <Control.Inside>
        <NumberStepper
          value={valueSafe}
          onMouseDown={(e) => startDrag(e)}
          onChange={(evt) => {
            updateControl(evt.target.value);
          }}
          type="number"
        />
      </Control.Inside>
    </Control.Container>
  );
};

const NumberControl: ControlSchema = {
  name: 'number',
  supports: (type, options: options) => {
    if (type === 'timeline' && options.range) {
      return true;
    }

    return false;
  },
  render: (props: ControlProps<number, options>) => {
    const { range } = props.options;

    if (range) {
      return <NumberControlContinuous {...props} />;
    }

    return <NumberControlStepper {...props} />;
  },
};

export default NumberControl;
