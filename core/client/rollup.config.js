import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from 'rollup-plugin-replace';
import path from 'path';

const pkg = require('./package.json');

export default {
  input: 'src/index.js',
  output: [
    {
      name: pkg.name,
      file: 'dist/bundle.js',
      format: 'umd',
    },
    {
      name: pkg.name,
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
  ],
};
