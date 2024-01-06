import styled from 'styled-components';
import { JsonView, darkStyles, allExpanded } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

import { SPACING, Inner } from '@magic-circle/styles';
import { useReference } from '@magic-circle/state';

import type { ScreenshotFile } from './index';
import Screenshots from './index';
import { copyGitCommit, copyJSON } from './utils';

const Container = styled.div`
  padding-left: ${SPACING(4)}px;
  padding-top: ${SPACING(2)}px;
  padding-bottom: ${SPACING(2)}px;

  ._11RoI {
    background: none;
  }
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
        <JsonView
          data={screenshot.data}
          shouldExpandNode={allExpanded}
          style={darkStyles}
        />
      </Container>
    </Inner>
  );
};

export default JsonViewer;
