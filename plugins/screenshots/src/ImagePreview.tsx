import styled from 'styled-components';

import { Inner } from '@magic-circle/styles';

import type { ScreenshotFile } from './index';
import type Screenshots from './index';

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
`;

type ImagePreviewProps = {
  screenshots: Screenshots;
  screenshot: ScreenshotFile;
};

const ImagePreview = ({ screenshots, screenshot }: ImagePreviewProps) => {
  return (
    <Inner
      breadcrumbs={{
        plugin: {
          ...screenshots.sidebar(),
        },
        title: screenshot.fileName,
      }}
    >
      <Image src={screenshot.dataUrl} />;
    </Inner>
  );
};

export default ImagePreview;
