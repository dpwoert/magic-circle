import { useCallback, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';

import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import {
  Control,
  Icon,
  SPACING,
  COLORS,
  TYPO,
  Forms,
} from '@magic-circle/styles';

const Inside = styled(Control.Inside)`
  justify-content: space-between;
  gap: ${SPACING(0.5)}px;

  svg {
    cursor: pointer;

    &:hover {
      color: ${COLORS.accent.css};
    }
  }
`;

const GraphContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${SPACING(16)}px;
  background-color: ${COLORS.shades.s600.css};
  border-bottom: 1px solid ${COLORS.shades.s400.css};
`;

const Graph = styled.svg`
  width: 100%;
  height: 100%;
  cursor: crosshair;

  circle {
    cursor: pointer;
  }
`;

const GraphLegend = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

type LegendItemProps = {
  align: 'left' | 'right';
  x: number;
  y: number;
};

const LegendItem = styled.div<LegendItemProps>`
  ${TYPO.small}
  position: absolute;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  color: ${COLORS.shades.s300.css};
  padding: 3px;
  text-align: ${(props) => props.align || 'right'};
  transform: translateX(${(props) => (props.align === 'right' ? '-100%' : 0)})
    translateY(${(props) => (props.y > 95 ? '-100%' : 0)});
  white-space: nowrap;
`;

const mapLinear = (x, a1, a2, b1, b2): number =>
  b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};

type vector = number[] | { x: number; y: number; z?: number };

const vectorObject = (vector: vector) => {
  if (Array.isArray(vector)) {
    return {
      x: vector[0] as number,
      y: vector[1] as number,
      z: vector[2] as number,
    };
  }

  return vector;
};

const setVector = (
  original: vector,
  axis: 'x' | 'y' | 'z',
  newValue: number
) => {
  if (Array.isArray(original)) {
    const clone = original.slice(0);
    const index = {
      x: 0,
      y: 1,
      z: 2,
    };
    clone[index[axis]] = newValue;
    return clone;
  }

  const clone = JSON.parse(JSON.stringify(original));
  clone[axis] = newValue;
  return clone;
};

type VectorControlProps = {
  range?: number;
  precision?: number;
  defaultSecondaryAxis?: 'y' | 'z';
};

const VectorControlField = ({
  value,
  label,
  set,
  hasChanges,
  options,
  reset,
  select,
}: ControlProps<vector, VectorControlProps>) => {
  const element = useRef(null);
  const clicked = useRef(false);
  const [axis, setAxis] = useState<'y' | 'z'>(options.defaultSecondaryAxis);
  const range = options.range || [-10, 10];
  const precision = options.precision || 2;
  const hasZero = Math.abs(range[0]) === Math.abs(range[1]);

  const val = vectorObject(value);

  const position = [
    mapLinear(val.x, range[0], range[1], 0, 100),
    mapLinear(val[axis], range[1], range[0], 0, 100),
  ];

  const dimensions = useMemo(() => {
    // Get dimensions
    if (Array.isArray(value) && value.length > 2) {
      return 3;
    } else if (!Array.isArray(value) && value.z) {
      return 3;
    }
    return 2;
  }, [value]);

  const setFromJoystick = useCallback(
    (evt: React.MouseEvent) => {
      const box = element.current.getBoundingClientRect();

      const x = evt.clientX - box.x;
      const y = evt.clientY - box.y;
      const relX = x / box.width;
      const relY = y / box.height;
      const newX = mapLinear(relX, 0, 1, range[0], range[1]).toFixed(precision);
      const newY = mapLinear(relY, 0, 1, range[1], range[0]).toFixed(precision);

      let newValue = setVector(value, 'x', +newX);
      newValue = setVector(newValue, 'y', +newY);

      set(newValue);
    },
    [range, precision]
  );

  const onMouseDown = useCallback((evt: React.MouseEvent) => {
    clicked.current = true;
    setFromJoystick(evt);
  }, []);

  const onMouseUp = useCallback(() => {
    clicked.current = false;
  }, []);

  const onMouseMove = useCallback(
    (evt: React.MouseEvent) => {
      if (clicked.current) {
        setFromJoystick(evt);
      }
    },
    [setFromJoystick]
  );

  return (
    <Control.Large
      hasChanges={hasChanges}
      reset={reset}
      select={select}
      header={
        <>
          <Control.Label>{label}</Control.Label>
          <Inside>
            <Forms.Field
              value={val.x}
              onChange={(evt) => {
                set(setVector(value, 'x', +evt.target.value));
              }}
            />
            <Forms.Field
              value={val.y}
              onChange={(evt) => {
                set(setVector(value, 'y', +evt.target.value));
              }}
            />
            <Forms.Field
              value={val.z}
              onChange={(evt) => {
                set(setVector(value, 'z', +evt.target.value));
              }}
            />
          </Inside>
        </>
      }
    >
      <GraphContainer>
        <GraphLegend>
          {hasZero && (
            <LegendItem align="right" x={50} y={50}>
              0
            </LegendItem>
          )}
          <LegendItem align="left" x={0} y={50}>
            x: {range[0]}
          </LegendItem>
          <LegendItem align="right" x={100} y={50}>
            x: {range[1]}
          </LegendItem>
          <LegendItem align="right" x={50} y={0}>
            {axis}: {range[1]}
          </LegendItem>
          <LegendItem align="right" x={50} y={100}>
            {axis}: {range[0]}
          </LegendItem>
        </GraphLegend>
        <Graph
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          ref={element}
        >
          <line
            x1={0}
            x2="100%"
            y1="50%"
            y2="50%"
            stroke={COLORS.shades.s500.css}
            strokeWidth={1}
          />
          <line
            x1="50%"
            x2="50%"
            y1={0}
            y2="100%"
            stroke={COLORS.shades.s500.css}
            strokeWidth={1}
          />
          <circle
            cx={`${position[0]}%`}
            cy={`${position[1]}%`}
            r={8}
            fill="#2A203B"
            stroke={COLORS.accent.css}
          />
        </Graph>
      </GraphContainer>
    </Control.Large>
  );
};

const VectorControl: ControlSchema = {
  name: 'vector',
  render: (props: ControlProps<vector, VectorControlProps>) => {
    return <VectorControlField {...props} />;
  },
};

export default VectorControl;
