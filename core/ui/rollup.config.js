import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from 'rollup-plugin-babel';
import builtins from 'builtin-modules';
import injectElectron from './inject-electron';
import replace from 'rollup-plugin-replace';
import path from 'path';

const pkg = require(`${process.cwd()}/package.json`);

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
  external: [
    ...builtins,
    'styled-components',
    'react',
    'react-dom',
    'react-is',
  ],
  plugins: [
    peerDepsExternal(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      __dirname: id => `'${path.dirname(id)}'`,
    }),
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
    babel({
      // exclude: 'node_modules/**',
      // include: 'node_modules/**',
    }),
    commonjs({
      namedExports: {
        'node_modules/react-is/index.js': [
          'isValidElementType',
          'isElement',
          'ForwardRef',
        ],
        'node_modules/react/index.js': [
          'Component',
          'PureComponent',
          'Fragment',
          'Children',
          'createElement',
          'cloneElement',
          'createContext',
        ],
        'node_modules/react-dom/index.js': ['findDOMNode'],
      },
    }),
    injectElectron(),
  ],
};
