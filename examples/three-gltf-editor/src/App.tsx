import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { COLORS } from '@magic-circle/styles';

import Message from './Message';
import start from './start';
import Viewer from './Viewer';

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

const App = () => {
  const [showMessage, setShowMessage] = useState(true);
  const viewer = useRef<Viewer>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log({ acceptedFiles });

    let base;
    // const fileMap = new Map<string, File>();

    acceptedFiles.forEach((file) => {
      // fileMap.set(file.path, file);

      if (file.name.match(/\.(gltf|glb)$/)) {
        base = file;
      }
    });

    if (!base) {
      // todo
    }

    const url = URL.createObjectURL(base);
    console.log({ url });

    try {
      await viewer.current.view(url);
    } catch (e) {
      console.error(e);
    }

    setShowMessage(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    viewer.current = start();
  }, []);

  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} />
      {showMessage && <Message onUpload={() => console.log('test')} />}
      <Canvas />
    </Container>
  );
};

export default App;
