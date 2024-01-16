import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  CustomToneMapping,
  LinearToneMapping,
  NoToneMapping,
  ReinhardToneMapping,
  WebGLRenderer,
  SRGBColorSpace,
  LinearSRGBColorSpace,
  ToneMapping,
} from 'three';
import {
  Folder,
  TextControl,
  NumberControl,
  BooleanControl,
  Layer,
} from '@magic-circle/client';

export function webglRenderer(gl: WebGLRenderer) {
  const settings = {
    retina: gl.getPixelRatio() > 1,
  };

  const folders = [
    new Folder('Canvas').add([
      new BooleanControl(settings, 'retina').onUpdate((newVal) =>
        gl.setPixelRatio(newVal ? 2 : 1)
      ),
      new TextControl(gl, 'outputColorSpace').selection(
        [SRGBColorSpace, LinearSRGBColorSpace],
        ['SRGB', 'LinearSRGB']
      ),
    ]),
    new Folder('Tone mapping').add([
      new NumberControl(gl, 'toneMappingExposure').range(0, 2),
      new TextControl(gl, 'toneMapping')
        .selection(
          [
            NoToneMapping as any,
            LinearToneMapping as any,
            ReinhardToneMapping as any,
            CineonToneMapping as any,
            ACESFilmicToneMapping as any,
            CustomToneMapping as any,
          ],
          [
            'NoToneMapping',
            'LinearToneMapping',
            'ReinhardToneMapping',
            'CineonToneMapping',
            'ACESFilmicToneMapping',
            'CustomToneMapping',
          ]
        )
        .onUpdate((v) => {
          // eslint-disable-next-line
          gl.toneMapping = +v as ToneMapping;
        }),
    ]),
  ];

  return new Layer('WebGL render').add(folders);
}
