import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import {
  COLORS,
  registerIcon,
  Upload,
  FilePlus,
  ArrowLeft,
  WarningTriangle,
  Spinner,
} from '@magic-circle/styles';

import Message from './Message';
import start from './start';
import Viewer from './Viewer';
import { downloadFile } from './utils';

import exampleFile from './example.glb?url';

registerIcon(FilePlus);
registerIcon(Upload);
registerIcon(FilePlus);
registerIcon(ArrowLeft);
registerIcon(WarningTriangle);
registerIcon(Spinner);

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${COLORS.shades.s800.css};
`;

const Canvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${COLORS.shades.s800.css};
`;

type Stage = 'upload' | 'loading' | 'error' | 'viewer';

const App = () => {
  const viewer = useRef<Viewer>(null);
  const [stage, setStage] = useState<Stage>('upload');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    let base: File;
    const files: Map<string, File> = new Map();

    setStage('loading');

    acceptedFiles.forEach((file) => {
      // @ts-expect-error
      files.set(file.path, file);

      // determine root file
      if (file.name.match(/\.(gltf|glb)$/)) {
        base = file;
      }
    });

    if (!base) {
      return;
    }

    try {
      await viewer.current.view(base, files);
      setStage('viewer');
    } catch (e) {
      setStage('error');
      console.error(e);
    }
  }, []);

  const loadExample = useCallback(async () => {
    setStage('loading');

    try {
      const base = await downloadFile(exampleFile, 'example.glb');
      await viewer.current.view(base, new Map());
      setStage('viewer');
    } catch (e) {
      setStage('error');
      console.error(e);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    viewer.current = start();
  }, []);

  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} />
      {stage === 'upload' && (
        <Message
          icon="FilePlus"
          text={
            <>
              Drag & drop a file here to load, or click{' '}
              <span
                onClick={(evt) => {
                  evt.stopPropagation();
                  loadExample();
                }}
              >
                here
              </span>{' '}
              for an example file
            </>
          }
          button={{ icon: 'Upload', label: 'Select file' }}
        />
      )}
      {stage === 'loading' && (
        <Message icon="Spinner" text="Loading file(s)..." />
      )}
      {stage === 'error' && (
        <Message
          icon="WarningTriangle"
          text="Error while trying to upload file"
          button={{
            icon: 'ArrowLeft',
            label: 'Back',
            onClick: () => {
              setStage('upload');
            },
          }}
        />
      )}
      <Canvas />
    </Container>
  );
};

export default App;
