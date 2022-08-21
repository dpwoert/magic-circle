import { useCallback } from 'react';
import styled from 'styled-components';

import { Control as ControlSchema, ControlProps } from '@magic-circle/schema';
import {
  Control,
  Icon,
  SPACING,
  COLORS,
  registerIcon,
  Upload,
} from '@magic-circle/styles';

registerIcon(Upload);

const Inside = styled(Control.Inside)`
  justify-content: flex-end;

  svg {
    cursor: pointer;

    &:hover {
      color: ${COLORS.accent.css};
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: ${SPACING(16)}px;
  object-fit: cover;
`;

const ImageControlField = ({
  value,
  label,
  set,
  hasChanges,
  reset,
  select,
}: ControlProps<string, never>) => {
  const upload = useCallback(async () => {
    // @ts-ignore
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Images',
          accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
          },
        },
      ],
      excludeAcceptAllOption: false,
      multiple: false,
    });

    // Create blob
    const file = await fileHandle.getFile();
    const arr: ArrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arr], { type: fileHandle.type });

    // Create base64 string
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      set(String(base64data));
    };
  }, [set]);

  return (
    <Control.Large
      hasChanges={hasChanges}
      reset={reset}
      select={select}
      header={
        <>
          <Control.Label>{label}</Control.Label>
          <Inside>
            <Icon
              name="Upload"
              width={SPACING(1.5)}
              height={SPACING(1.5)}
              onClick={upload}
            />
          </Inside>
        </>
      }
    >
      <Image src={value} />
    </Control.Large>
  );
};

const ImageControl: ControlSchema = {
  name: 'image',
  render: (props: ControlProps<string, never>) => {
    return <ImageControlField {...props} />;
  },
};

export default ImageControl;
