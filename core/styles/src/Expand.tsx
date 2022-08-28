import React, {
  memo,
  useRef,
  ReactNode,
  useState,
  useLayoutEffect,
} from 'react';
import styled from 'styled-components';

type ContainerProps = {
  expand: boolean;
  height: number;
  duration: number;
};

const Container = styled.div<ContainerProps>`
  max-height: ${(props) => {
    if (props.height === null) return 'auto';
    return props.expand ? `${props.height}px` : 0;
  }};
  transition: max-height ${(props) => props.duration}ms ease;
  overflow: hidden;
`;

type ExpandProps = {
  children: ReactNode;
  duration?: number;
  expand: boolean;
};

const Expand = ({
  children,
  expand,
  duration = 300,
  ...props
}: ExpandProps) => {
  const ref = useRef(null);
  const [height, setHeight] = useState<number>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [expand, children, ref]);

  return (
    <Container
      ref={ref}
      height={height}
      expand={expand}
      duration={duration}
      {...props}
    >
      {children}
    </Container>
  );
};

export default memo(Expand);
