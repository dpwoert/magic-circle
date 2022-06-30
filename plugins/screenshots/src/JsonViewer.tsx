import styled from 'styled-components';
import ReactJson from 'react-json-view';

import { COLORS, SPACING, Inner } from '@magic-circle/styles';
import { useReference } from '@magic-circle/state';

import type { ScreenshotFile } from './index';
import Screenshots from './index';
import { copyGitCommit, copyJSON } from './utils';

const Container = styled.div`
  padding-left: ${SPACING(4)}px;
  padding-top: ${SPACING(2)}px;
  padding-bottom: ${SPACING(2)}px;
`;

type JsonViewerProps = {
  screenshots: Screenshots;
  screenshot: ScreenshotFile;
};

const JsonViewer = ({ screenshot, screenshots }: JsonViewerProps) => {
  useReference({ id: screenshot.fileName, type: 'screenshot' });
  return (
    <Inner
      breadcrumbs={{
        plugin: {
          ...screenshots.sidebar(),
        },
        title: screenshot.fileName,
      }}
      buttons={[
        {
          label: 'Copy JSON',
          icon: 'Copy',
          onClick: () => {
            copyJSON(screenshot);
          },
        },
        {
          label: 'Copy Git commit',
          icon: 'Code',
          onClick: () => {
            copyGitCommit(screenshot);
          },
          hide: !screenshot.data.git,
        },
        {
          label: 'View screenshot',
          icon: 'Photo',
          onClick: () => {
            screenshots.previewImage(screenshot);
          },
        },
        {
          label: 'Rename',
          icon: 'Tag',
          onClick: () => {
            screenshots.renameScreenshot(screenshot);
          },
        },
        {
          label: 'Delete',
          icon: 'Trash',
          onClick: () => {
            screenshots.deleteScreenshot(screenshot);
          },
        },
      ]}
    >
      <Container>
        <ReactJson
          src={screenshot.data}
          theme="monokai"
          iconStyle="circle"
          style={{ background: COLORS.shades.s500.css }}
        />
      </Container>
    </Inner>
  );
};

export default JsonViewer;
