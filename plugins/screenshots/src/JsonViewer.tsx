import styled from 'styled-components';
import ReactJson from 'react-json-view';

import { TYPO, COLORS, SPACING, Icon } from '@magic-circle/styles';

import type { ScreenshotFile } from './index';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  padding-top: ${SPACING(2)}px;
  padding-left: ${SPACING(4)}px;
  overflow: auto;
`;

const Header = styled.div`
  ${TYPO.large}
  color: ${COLORS.white.css};
  margin-bottom: ${SPACING(1)}px;
`;

const Actions = styled.div`
  display: flex;
  margin-bottom: ${SPACING(3)}px;
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
  screenshot: ScreenshotFile;
};

const JsonViewer = ({ screenshot }: JsonViewerProps) => {
  return (
    <Container>
      <Header>{screenshot.fileName.replace('.png', '')}</Header>
      <Actions>
        <Action>
          <Icon name="Copy" width={SPACING(1.5)} height={SPACING(1.5)} />
          Copy JSON
        </Action>
        <Action>
          <Icon name="Photo" width={SPACING(1.5)} height={SPACING(1.5)} />
          View screenshot
        </Action>
        <Action>
          <Icon name="Trash" width={SPACING(1.5)} height={SPACING(1.5)} />
          Delete
        </Action>
      </Actions>
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
