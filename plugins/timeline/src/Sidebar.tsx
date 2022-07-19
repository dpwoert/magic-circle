import styled from 'styled-components';

// import { useStore } from '@magic-circle/state';
// import { SPACING, COLORS, TYPO } from '@magic-circle/styles';

import type Timeline from './index';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type SidebarProps = {
  timeline: Timeline;
};

const Sidebar = ({}: SidebarProps) => {
  return <Container>todo</Container>;
};

export default Sidebar;
