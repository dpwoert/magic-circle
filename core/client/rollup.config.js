import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import path from 'path';
// import { visualiser } from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';

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
        plugins: [terser()],
      },
      {
        file: 'dist/magic-circle.cjs.j',
        format: 'cjs',
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
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: true }),
      // process.env.STATS && visualiser(),
    ],
  },
  {
    input: './dist/types/index.d.ts',
    output: [{ file: 'dist/magic-circle.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
