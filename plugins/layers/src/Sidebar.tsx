import type { ReactNode } from 'react'
import styled from 'styled-components';
import { SPACING, COLORS, Icon } from '@magic-circle/styles';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type LayerProps = {
  depth: number;
}

const Layer = styled.div<LayerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left ${props => SPACING(props.depth * 2) + SPACING(1)}px;
  padding-right ${SPACING(1)}px;
  align-items: center;
  height: ${SPACING(4)}px;
  color: ${COLORS.white.css};

  &:nth-child(2n) {
    background: ${COLORS.shades.s500.css};
  }
`;

const Sidebar = () => {
  return (
    <Container>
      <Layer depth={0}>
        <span>World</span>
        <Icon name="ChevronDown" width={SPACING(2)} height={SPACING(2)} />
      </Layer>
      <Layer depth={1}>Layer 2</Layer>
    </Container>
  );
};

export default Sidebar;
