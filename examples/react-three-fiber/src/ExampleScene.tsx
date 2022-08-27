import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

import { MagicCircle, Layer, Folder, NumberControl } from '@magic-circle/react';

const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
    }
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      <Layer name={`Box ${props.nr}`}>
        <Folder name="Position">
          <NumberControl value={1} onUpdate={(v) => console.log(v)} />
        </Folder>
      </Layer>
    </mesh>
  );
};

const ExampleScene = () => {
  return (
    <Canvas>
      <MagicCircle>
        <Layer name={`Scene`}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box nr={1} position={[-1.2, 0, 0]} />
          <Box nr={2} position={[1.2, 0, 0]} />
        </Layer>
      </MagicCircle>
    </Canvas>
  );
};

export default ExampleScene;
