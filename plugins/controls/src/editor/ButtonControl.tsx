import styled from 'styled-components';

import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import { Control, SPACING, COLORS, Icon } from '@magic-circle/styles';

type options = {};

const Container = styled(Control.Container)`
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.white.css};

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
}: ControlProps<() => void, options>) => {
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
  render: (props: ControlProps<() => void, options>) => {
    return <ButtonControlField {...props} />;
  },
};

export default ButtonControl;
