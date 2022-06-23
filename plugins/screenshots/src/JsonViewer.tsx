import styled from 'styled-components';
import ReactJson from 'react-json-view';

import { TYPO, COLORS, SPACING, Icon } from '@magic-circle/styles';
import { useReference } from '@magic-circle/state';

import type { ScreenshotFile } from './index';
import Screenshots from './index';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  padding-left: ${SPACING(4)}px;
  overflow: auto;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  padding-top: ${SPACING(2)}px;
  padding-bottom: ${SPACING(3)}px;
  background: ${COLORS.shades.s500.css};
  z-index: 1;
`;

const Title = styled.div`
  ${TYPO.large}
  color: ${COLORS.white.css};
  margin-bottom: ${SPACING(1)}px;
`;

const Actions = styled.div`
  display: flex;
  gap: ${SPACING(2)}px;
  color: ${COLORS.white.css};
`;

const Action = styled.div`
  ${TYPO.small}
  display: flex;
  align-items: center;
  gap: ${SPACING(1)}px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${COLORS.accent.css};
  }
`;

type JsonViewerProps = {
  screenshots: Screenshots;
  screenshot: ScreenshotFile;
};

const JsonViewer = ({ screenshot, screenshots }: JsonViewerProps) => {
  useReference({ id: screenshot.fileName, type: 'screenshot' });
  return (
    <Container>
      <Header>
        <Title>{screenshot.fileName.replace('.png', '')}</Title>
        <Actions>
          <Action
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(screenshot.data));
            }}
          >
            <Icon name="Copy" width={SPACING(1.5)} height={SPACING(1.5)} />
            Copy JSON
          </Action>
          {screenshot.data.git && (
            <Action
              onClick={() => {
                navigator.clipboard.writeText(
                  `git checkout ${screenshot.data.git.sha}`
                );
              }}
            >
              <Icon name="Code" width={SPACING(1.5)} height={SPACING(1.5)} />
              Copy Git commit
            </Action>
          )}
          <Action
            onClick={() => {
              screenshots.previewImage(screenshot);
            }}
          >
            <Icon name="Photo" width={SPACING(1.5)} height={SPACING(1.5)} />
            View screenshot
          </Action>
          <Action
            onClick={() => {
              screenshots.renameScreenshot(screenshot);
            }}
          >
            <Icon name="Tag" width={SPACING(1.5)} height={SPACING(1.5)} />
            Rename
          </Action>
          <Action
            onClick={() => {
              screenshots.renameScreenshot(screenshot);
            }}
          >
            <Icon name="Trash" width={SPACING(1.5)} height={SPACING(1.5)} />
            Delete
          </Action>
        </Actions>
      </Header>
      <ReactJson
        src={screenshot.data}
        theme="monokai"
        iconStyle="circle"
        style={{ background: COLORS.shades.s500.css }}
      />
    </Container>
  );
};

export default JsonViewer;
