import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  memo,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import styled, { css, keyframes } from 'styled-components';

// import useOnBlur from '../hooks/useOnBlur';

import COLORS from './colors';

const TRIANGLE_SIZE = 5;

export enum Placement {
  TOP = 'top',
  RIGHT = 'right',
  LEFT = 'left',
  BOTTOM = 'bottom',
}

export enum Alignment {
  CENTER = 'center',
  START = 'start',
  END = 'end',
}

type PinProps = {
  placement: Placement;
  background?: string;
};

const Pin = styled.div<PinProps>`
  pointer-events: none;
  position: absolute;
  border-style: solid;
  border-width: ${TRIANGLE_SIZE}px;
  border-color: ${(props) => props.background};
  z-index: 10;
  ${(props) => {
    switch (props.placement) {
      case Placement.TOP:
        return `border-bottom-width: 0;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
        top: 0px;
        left: calc(50% - ${TRIANGLE_SIZE}px)
      `;
      case Placement.BOTTOM:
        return `border-top-width: 0;
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
        bottom: 0px;
        left: calc(50% - ${TRIANGLE_SIZE}px)
      `;
      case Placement.LEFT:
        return `border-right-width: 0;
        border-bottom-color: transparent;
        border-top-color: transparent;
        border-right-color: transparent;
        left: 0px;
        top: calc(50% - ${TRIANGLE_SIZE}px)
      `;
      case Placement.RIGHT:
        return `border-left-width: 0;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-top-color: transparent;
        right: 0px;
        top: calc(50% - ${TRIANGLE_SIZE}px)
      `;
      default:
        return '';
    }
  }}
`;

type BoxProps = {
  placement: Placement;
  alignment: Alignment;
  offset: number;
};

const Box = styled.div<BoxProps>`
  position: absolute;
  display: flex;
  ${(props) => {
    switch (props.placement) {
      case Placement.LEFT:
        switch (props.alignment) {
          case Alignment.START:
            return `top: 0%; transform: translate(-100%, 0%)`;
          case Alignment.END:
            return `bottom: 0%; transform: translate(-100%, 0%)`;
          case Alignment.CENTER:
          default:
            return `top: 50%; transform: translate(-100%, -50%)`;
        }
      case Placement.RIGHT:
        switch (props.alignment) {
          case Alignment.START:
            return `top: 0%; transform: translate(0%, 0%)`;
          case Alignment.END:
            return `bottom: 0%; transform: translate(0%, 0%)`;
          case Alignment.CENTER:
          default:
            return `top: 50%; transform: translate(0%, -50%)`;
        }
      case Placement.BOTTOM:
        switch (props.alignment) {
          case Alignment.START:
            return `left: 0%; transform: translate(0%, 0%)`;
          case Alignment.END:
            return `right: 0%; transform: translate(0%, 0%)`;
          case Alignment.CENTER:
          default:
            return `left: 50%; transform: translate(-50%, 0%)`;
        }
      case Placement.TOP:
      default:
        switch (props.alignment) {
          case Alignment.START:
            return `left: 0%; transform: translate(0%, -100%)`;
          case Alignment.END:
            return `right: 0%; transform: translate(0%, -100%)`;
          case Alignment.CENTER:
          default:
            return `left: 50%; transform: translate(-50%, -100%)`;
        }
    }
  }};

  &:after {
    content: '';
    background: transparent;
    position: absolute;
    ${(props) => {
      switch (props.placement) {
        case Placement.LEFT:
          return css`
            right: -${props.offset}px;
            width: ${props.offset}px;
            height: 100%;
          `;
        case Placement.RIGHT:
          return css`
            left: -${props.offset}px;
            width: ${props.offset}px;
            height: 100%;
          `;
        case Placement.BOTTOM:
          return css`
            top: -${props.offset}px;
            height: ${props.offset}px;
            width: 100%;
          `;
        case Placement.TOP:
        default:
          return css`
            bottom: -${props.offset}px;
            height: ${props.offset}px;
            width: 100%;
          `;
      }
    }};
  }
`;

type ContainerProps = {
  position: [number, number];
  size: [number, number];
};

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const Container = styled.div<ContainerProps>`
  position: fixed;
  width: ${(props) => props.size[0] || 0}px;
  height: ${(props) => props.size[1] || 0}px;
  top: ${(props) => props.position[1] || 0}px;
  left: ${(props) => props.position[0] || 0}px;
  overflow: visible;
  display: flex;
  animation: ${fadeIn} 0.3s ease;
  z-index: 9999;
`;

const Inner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;

const Wrapper = styled.div`
  display: inline-flex;
`;

export type PopoverProps = {
  children:
    | React.ReactNode
    | ((
        toggle?: (value?: boolean) => void,
        isVisible?: boolean
      ) => React.ReactNode);
  content:
    | React.ReactNode
    | ((toggle?: (value?: boolean) => void) => React.ReactNode);
  placement?: Placement;
  alignment?: Alignment;
  offset?: number;
  background?: string;
  showOnClick?: boolean;
  disabled?: boolean;
  target?: HTMLElement;
  onClick?: () => void;
};

const Popover = ({
  children,
  content,
  placement = Placement.TOP,
  alignment = Alignment.CENTER,
  offset = 2,
  disabled = false,
  showOnClick = false,
  background = COLORS.shades.s700.css,
  target,
  ...props
}: PopoverProps) => {
  // create a unique id for each instance of this component
  // const idGen = String(Math.round(Math.random() * 1000));
  // const [id] = useState<string>(`popover-trigger-${idGen}`);
  const container = useRef(null);
  const contentRef = useRef(null);
  const portal = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [size, setSize] = useState<[number, number]>([0, 0]);

  // use unique id as data-attribute to detect clicks inside the component and ignore useOnBlur
  // useOnBlur(id, contentRef, visible && !disabled && showOnClick, () => {
  //   setVisible(false);
  // });

  const toggle = useCallback(
    (value?: boolean) => {
      if (showOnClick) {
        setVisible((prev) => (typeof value === 'boolean' ? value : !prev));
      }
    },
    [showOnClick]
  );

  const handleHover = useCallback(
    (value: boolean) => {
      if (!showOnClick) {
        setVisible(value);
      }
    },
    [showOnClick]
  );

  useEffect(() => {
    const listener = () => {
      if (visible && container.current) {
        const element = target || container.current;
        const box: DOMRect = element.getBoundingClientRect();

        const totalOffset = offset + TRIANGLE_SIZE;
        switch (placement) {
          case Placement.TOP:
            setPosition([box.x, box.y - totalOffset]);
            setSize([box.width, 0]);
            break;
          case Placement.BOTTOM:
            setPosition([box.x, box.y + box.height + totalOffset]);
            setSize([box.width, 0]);
            break;
          case Placement.LEFT:
            setPosition([box.x - totalOffset, box.y]);
            setSize([0, box.height]);
            break;
          case Placement.RIGHT:
            setPosition([box.x + box.width + totalOffset, box.y]);
            setSize([0, box.height]);
            break;
          default:
            break;
        }
      }
    };
    listener();

    window.addEventListener('scroll', listener, true);
    window.addEventListener('resize', listener, true);
    return () => {
      window.removeEventListener('scroll', listener, true);
      window.removeEventListener('resize', listener, true);
    };
  }, [target, placement, offset, visible]);

  const childrenElement = useMemo(() => {
    return typeof children === 'function'
      ? children(toggle, visible)
      : children;
  }, [children, toggle, visible]);

  return (
    <>
      {visible &&
        !disabled &&
        ReactDOM.createPortal(
          <Container ref={portal} position={position} size={size}>
            <Inner>
              <Box
                ref={contentRef}
                placement={placement}
                alignment={alignment}
                onMouseLeave={() => handleHover(false)}
                offset={offset + TRIANGLE_SIZE}
              >
                {typeof content === 'function' ? content(toggle) : content}
              </Box>
              <Pin placement={placement} background={background} />
            </Inner>
          </Container>,
          document.body
        )}
      <Wrapper
        ref={container}
        onMouseEnter={() => handleHover(true)}
        onMouseOver={() => handleHover(true)}
        onMouseLeave={(e) => {
          // check if next element is the popover.
          // if it is not, set visible to false

          const el = e.relatedTarget as HTMLElement;

          const contains =
            portal.current && el && el.nodeType && portal.current.contains(el);
          if (!contains) {
            handleHover(false);
          }
        }}
        {...props}
      >
        {childrenElement}
      </Wrapper>
    </>
  );
};

export default memo(Popover);
