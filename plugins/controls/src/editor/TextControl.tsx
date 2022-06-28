import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import { Control, Forms } from '@magic-circle/styles';

type options = {
  selection: {
    keys: string[];
    labels?: string[];
  };
};

const TextControlSelect = ({
  value,
  label,
  options,
  set,
  reset,
  hasChanges,
}: ControlProps<string, options>) => {
  const values = options.selection.keys;
  const labels = options.selection.labels || [...values];
  return (
    <Control.Container hasChanges={hasChanges} reset={reset}>
      <Control.Label>{label}</Control.Label>
      <Control.Inside>
        <Forms.Select
          value={value}
          onChange={(evt) => {
            set(evt.target.value);
          }}
        >
          {values.map((value, k) => (
            <option value={value} key={value}>
              {labels[k]}
            </option>
          ))}
        </Forms.Select>
      </Control.Inside>
    </Control.Container>
  );
};

const TextControlField = ({
  value,
  label,
  set,
  hasChanges,
  reset,
}: ControlProps<string, options>) => {
  return (
    <Control.Container hasChanges={hasChanges} reset={reset}>
      <Control.Label>{label}</Control.Label>
      <Control.Inside>
        <Forms.Field
          value={value}
          onChange={(evt) => {
            set(evt.target.value);
          }}
        />
      </Control.Inside>
    </Control.Container>
  );
};

const TextControl: ControlSchema = {
  name: 'text',
  render: (props: ControlProps<string, options>) => {
    const { selection } = props.options;

    if (selection) {
      return <TextControlSelect {...props} />;
    }

    return <TextControlField {...props} />;
  },
};

export default TextControl;
