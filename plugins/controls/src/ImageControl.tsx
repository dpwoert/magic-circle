import { useCallback, useMemo } from 'react';
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

const checkColor = COLORS.shades.s700.css;

const Placeholder = styled.div`
  width: 100%;
  height: ${SPACING(16)}px;
  background-color: ${COLORS.shades.s500.css};
  background-image: linear-gradient(45deg, ${checkColor} 25%, transparent 25%),
    linear-gradient(-45deg, ${checkColor} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${checkColor} 75%),
    linear-gradient(-45deg, transparent 75%, ${checkColor} 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageControlField = ({
  value,
  label,
  set,
  hasChanges,
  reset,
  select,
}: ControlProps<string | ImageBitmap, Record<string, never>>) => {
  const src = useMemo<string>(() => {
    if (typeof value === 'string') {
      return value;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = value.width;
    canvas.height = value.height;

    if (context) context.drawImage(value, 0, 0, value.width, value.height);
    return canvas.toDataURL('image/png');
  }, [value]);

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

    if (typeof value === 'string') {
      // Create base64 string
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        set(String(base64data));
      };
    } else {
      // Create new bitmap
      const newBitmap = await createImageBitmap(blob);
      set(newBitmap);
    }
  }, [set, value]);

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
      <Placeholder>
        <Image src={src} />
      </Placeholder>
    </Control.Large>
  );
};

const ImageControl: ControlSchema<
  string | ImageBitmap,
  Record<string, never>
> = {
  name: 'image',
  render: (props) => {
    return <ImageControlField {...props} />;
  },
};

export default ImageControl;
