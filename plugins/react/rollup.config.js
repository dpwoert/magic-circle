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
        file: 'dist/magic-circle-react.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/magic-circle-react.esm.js',
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
    output: [{ file: 'dist/magic-circle-react.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
