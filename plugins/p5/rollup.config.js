import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import path from 'path';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'createMagicCircle',
        file: 'dist/magic-circle-p5.js',
        format: 'umd',
      },
      {
        name: 'createMagicCircle',
        file: 'dist/magic-circle-p5.min.js',
        format: 'umd',
        plugins: [terser()],
      },
      {
        file: 'dist/magic-circle-p5.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/magic-circle-p5.esm.js',
        format: 'esm',
      },
    ],
    external: [],
    plugins: [
      peerDepsExternal(),
      replace({
        preventAssignment: true,
        ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        __dirname: (id) => `'${path.dirname(id)}'`,
      }),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: true }),
    ],
  },
  {
    input: './dist/types/index.d.ts',
    output: [{ file: 'dist/magic-circle.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
