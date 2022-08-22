import styled from 'styled-components';

import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import { Control, SPACING, COLORS, Icon } from '@magic-circle/styles';

const Container = styled(Control.Container)`
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.white.css};
  cursor: pointer;

  svg {
    color: ${COLORS.accent.css};
  }
`;

const Inside = styled(Control.Inside)`
  justify-content: flex-end;
`;

const ButtonControlField = ({
  value,
  label,
  set,
  reset,
}: ControlProps<() => void, never>) => {
  return (
    <Container hasChanges={false} reset={reset} onClick={() => set(value)}>
      <Control.Label>{label}</Control.Label>
      <Inside>
        <Icon name="ArrowRight" width={SPACING(2)} height={SPACING(2)} />
      </Inside>
    </Container>
  );
};

const ButtonControl: ControlSchema = {
  name: 'button',
  render: (props: ControlProps<() => void, never>) => {
    return <ButtonControlField {...props} />;
  },
};

export default ButtonControl;
