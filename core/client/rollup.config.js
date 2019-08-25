import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

const production = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: [
    {
      name: 'controls',
      file: 'dist/bundle.js',
      format: 'umd',
    },
    {
      name: 'controls',
      file: 'dist/bundle.min.js',
      format: 'umd',
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'esm',
    },
  ],
  external: [],
  plugins: [
    peerDepsExternal(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      __dirname: id => `'${path.dirname(id)}'`,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
    commonjs(),
    terser({
      include: production ? [/^.+\.min\.js$/, '*esm*'] : [/^.+\.min\.js$/],
    }),
  ],
};
