import styled from 'styled-components';

import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import { Control, Forms } from '@magic-circle/styles';

const Inside = styled(Control.Inside)`
  justify-content: flex-end;
`;

const BooleanControlField = ({
  value,
  label,
  set,
  hasChanges,
  reset,
  select,
}: ControlProps<boolean, never>) => {
  return (
    <Control.Container hasChanges={hasChanges} reset={reset} select={select}>
      <Control.Label>{label}</Control.Label>
      <Inside>
        <Forms.Checkbox
          value={value}
          onChange={(newVal) => {
            set(newVal);
          }}
        />
      </Inside>
    </Control.Container>
  );
};

const BooleanControl: ControlSchema<boolean, never> = {
  name: 'boolean',
  supports: (type) => {
    if (type === 'timeline') {
      return true;
    }

    return false;
  },
  render: (props) => {
    return <BooleanControlField {...props} />;
  },
};

export default BooleanControl;
