import React from 'react';
import styled from 'styled-components';

import {
  COLORS,
  TYPO,
  SPACING,
  Icon,
  registerIcon,
  Forms,
  FilePlus,
  Upload,
} from '@magic-circle/styles';

registerIcon(FilePlus);
registerIcon(Upload);

const Container = styled.div`
  ${TYPO.small}
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  color: ${COLORS.white.css};
  gap: ${SPACING(1)}px;
  padding: ${SPACING(6)}px ${SPACING(1)}px;
`;

const ButtonStyled = styled(Forms.Button)`
  margin-top: ${SPACING(3)}px;
  color: ${COLORS.white.css};
  border-color: ${COLORS.accent.css};
`;

const Message = () => {
  return (
    <Container>
      <Icon name="FilePlus" height={SPACING(2)} width={SPACING(2)} />
      Drag & drop a file here to load
      <ButtonStyled onClick={() => onUpload()}>
        <Icon name="Upload" height={SPACING(1.5)} width={SPACING(1.5)} />
        Select file
      </ButtonStyled>
    </Container>
  );
};

export default Message;
