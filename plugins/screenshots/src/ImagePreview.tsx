import styled from 'styled-components';

import type { ScreenshotFile } from './index';

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
`;

type ImagePreviewProps = {
  screenshot: ScreenshotFile;
};

const ImagePreview = ({ screenshot }: ImagePreviewProps) => {
  return <Image src={screenshot.dataUrl} />;
};

export default ImagePreview;
