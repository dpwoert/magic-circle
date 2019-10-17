import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from 'rollup-plugin-babel';
import builtins from 'builtin-modules';
import replace from 'rollup-plugin-replace';
import url from 'rollup-plugin-url';
import jscc from 'rollup-plugin-jscc';
import json from 'rollup-plugin-json';
import injectElectron from './inject-electron';

const pkg = require('./package.json');

// create web safe bundle?
const WEB = process.env.WEB === '1';

export default {
  input: 'src/index.js',
  output: WEB
    ? [
        {
          name: pkg.name,
          file: 'dist/bundle.web.js',
          format: 'umd',
        },
      ]
    : [
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
    jscc({
      values: { _WEB: WEB },
    }),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
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
    url({
      limit: 1204 * 1024, // inline files < 10k, copy files > 10k
      include: ['**/*.png'],
      emitFiles: true, // defaults to true
    }),
    injectElectron(),
    json({
      exclude: ['node_modules/**'],
      compact: true,
      namedExports: true,
    }),
  ],
};
