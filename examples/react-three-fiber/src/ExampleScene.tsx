import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Scene } from 'three';
import { PerspectiveCamera } from '@react-three/drei';

import {
  MagicCircle,
  Layer,
  Folder,
  NumberControl,
  ColorControl,
  BooleanControl,
} from '@magic-circle/react';

type BoxProps = {
  x: number;
  y: number;
  z: number;
  i: number;
};

const Box = ({ x, y, z, i }: BoxProps) => {
  const [hovered, hover] = useState(false);

  const [positionX, setPositionX] = useState(x * 100);
  const [positionY, setPositionY] = useState(y * 100);
  const [positionZ, setPositionZ] = useState(z * 100);

  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [scaleZ, setScaleZ] = useState(1);

  const [color, setColor] = useState('#ff0000');
  const [opacity, setOpacity] = useState(1);
  const [transparant, setTransparant] = useState(true);

  return (
    <mesh
      position-x={positionX}
      position-y={positionY}
      position-z={positionZ}
      scale-x={scaleX}
      scale-y={scaleY}
      scale-z={scaleZ}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <boxGeometry args={[50, 50, 50]} />
      <meshStandardMaterial
        color={hovered ? 'hotpink' : color}
        opacity={opacity}
        transparent={transparant}
      />
      <Layer name={`Box ${i}`}>
        <Folder name="Position">
          <NumberControl
            name="x"
            value={positionX}
            onUpdate={setPositionX}
            range={[-200, 200]}
          />
          <NumberControl
            name="y"
            value={positionY}
            onUpdate={setPositionY}
            range={[-200, 200]}
          />
          <NumberControl
            name="z"
            value={positionZ}
            onUpdate={setPositionZ}
            range={[-200, 200]}
          />
        </Folder>
        <Folder name="Scale">
          <NumberControl
            name="x"
            value={scaleX}
            onUpdate={setScaleX}
            range={[0, 15]}
          />
          <NumberControl
            name="y"
            value={scaleY}
            onUpdate={setScaleY}
            range={[0, 15]}
          />
          <NumberControl
            name="z"
            value={scaleZ}
            onUpdate={setScaleZ}
            range={[0, 15]}
          />
        </Folder>
        <Folder name="Material">
          <ColorControl
            name="color"
            value={color}
            onUpdate={(v) => setColor(String(v))}
          />
          <NumberControl
            name="opacity"
            value={opacity}
            onUpdate={setOpacity}
            range={[0, 1]}
          />
          <BooleanControl
            name="transparant"
            value={transparant}
            onUpdate={setTransparant}
          />
        </Folder>
      </Layer>
    </mesh>
  );
};

type BoxesProps = {
  boxes: BoxProps[];
};

const Boxes = ({ boxes }: BoxesProps) => {
  const ref = useRef<Scene>();
  const [x, setX] = useState(0.005);
  const [y, setY] = useState(0.01);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += x;
      ref.current.rotation.y += y;
    }
  });

  return (
    <scene ref={ref}>
      {boxes.map((box) => (
        <Box {...box} />
      ))}
      <Layer name="Animation">
        <Folder name="Rotation">
          <NumberControl name="x" value={x} onUpdate={setX} stepSize={0.001} />
          <NumberControl name="y" value={y} onUpdate={setY} stepSize={0.001} />
        </Folder>
      </Layer>
    </scene>
  );
};

const Camera = () => {
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [positionZ, setPositionZ] = useState(400);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={70}
        position={[positionX, positionY, positionZ]}
      />
      <Layer name="Camera">
        <Folder name="Position">
          <NumberControl
            name="x"
            value={positionX}
            onUpdate={setPositionX}
            range={[-400, 400]}
          />
          <NumberControl
            name="y"
            value={positionY}
            onUpdate={setPositionZ}
            range={[-400, 400]}
          />
          <NumberControl
            name="z"
            value={positionZ}
            onUpdate={setPositionZ}
            range={[0, 800]}
          />
        </Folder>
      </Layer>
    </>
  );
};

const ExampleScene = () => {
  const boxes = useMemo<BoxProps[]>(() => {
    const list: BoxProps[] = [];

    let i = 1;
    for (let x = 0; x < 2; x += 1) {
      for (let y = 0; y < 2; y += 1) {
        for (let z = 0; z < 2; z += 1) {
          list.push({ x, y, z, i });
          i += 1;
        }
      }
    }

    return list;
  }, []);

  return (
    <Canvas>
      <MagicCircle>
        <Layer name={`Scene`}>
          <ambientLight />
          <Camera />
          <pointLight position={[10, 10, 10]} />
          <Boxes boxes={boxes} />
        </Layer>
      </MagicCircle>
    </Canvas>
  );
};

export default ExampleScene;
