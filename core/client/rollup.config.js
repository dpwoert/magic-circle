import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import path from 'path';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'magicCircle',
        file: 'dist/magic-circle.js',
        format: 'umd',
      },
      {
        name: 'magicCircle',
        file: 'dist/magic-circle.min.js',
        format: 'umd',
      },
      {
        file: 'dist/magic-circle.esm.js',
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
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  {
    input: './dist/types/index.d.ts',
    output: [{ file: 'dist/magic-circle.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
