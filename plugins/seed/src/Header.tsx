import styled from 'styled-components';

import { useStore } from '@magic-circle/state';
import { SPACING, COLORS, TYPO } from '@magic-circle/styles';

import type SeedPlugin from './index';

const Container = styled.div`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  height: ${SPACING(3)}px;
  color: ${COLORS.white.css};
  padding: 0 ${SPACING(1)}px;
  gap: ${SPACING(0.5)}px;
  border: 1px solid ${COLORS.accent.css};
  border-radius: 5px;

  span {
    ${TYPO.small}
    color: ${COLORS.shades.s200.css};
  }
`;

type HeaderProps = {
  store: SeedPlugin['seed'];
  generate: () => void;
};

const truncate = (string: string, max: number) =>
  string.length > max ? `${string.substring(0, max)}...` : string;

const Header = ({ store, generate }: HeaderProps) => {
  const seed = useStore(store);
  const seedFormatted = String(seed).replace('0.', '');

  return (
    <Container onClick={() => generate()}>
      Seed<span>{truncate(seedFormatted, 7)}</span>
    </Container>
  );
};

export default Header;
